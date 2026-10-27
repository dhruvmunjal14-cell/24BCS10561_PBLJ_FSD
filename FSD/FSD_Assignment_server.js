const ex = require('express');
const mg = require('mongoose');

const PORT_NO = process.env.PORT || 3000;
const DB_URL = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_events';

const OID_RX = /^[0-9a-fA-F]{24}$/;
const MAIL_RX = /^[^\s@]+@[^\s@]+\.(edu|ac\.in)$/;
const ROLL_RX = /^[A-Z0-9]{8,10}$/;

const EVT_LIST = ['CODING_HACKATHON', 'AI_WORKSHOP', 'ROBOTICS', 'GAMING'];
const STS_LIST = ['PENDING', 'CONFIRMED', 'CANCELLED'];
const EDIT_KEYS = [
  'studentName',
  'collegeEmail',
  'rollNumber',
  'eventType',
  'teamSize',
  'ticketPrice',
  'discountCode',
  'status'
];

class HttpFail extends Error {
  constructor(sc, ms) {
    super(ms);
    this.sc = sc;
  }
}

const rqd = (nm) => [true, `${nm} is required`];

const pk = (src, ks) =>
  ks.reduce((acc, k) => {
    if (src[k] !== undefined) acc[k] = src[k];
    return acc;
  }, {});

const wr = (fn) => (rq, rs, nx) => Promise.resolve(fn(rq, rs, nx)).catch(nx);

const chkId = (v) => {
  if (!OID_RX.test(String(v))) throw new HttpFail(400, 'Invalid registration ID format');
};

const sch = new mg.Schema(
  {
    studentName: {
      type: String,
      required: rqd('studentName'),
      trim: true,
      minlength: [3, 'studentName must be at least 3 characters'],
      maxlength: [50, 'studentName cannot exceed 50 characters']
    },
    collegeEmail: {
      type: String,
      required: rqd('collegeEmail'),
      unique: true,
      trim: true,
      lowercase: true,
      match: [MAIL_RX, 'Must be a valid college email ending in .edu or .ac.in']
    },
    rollNumber: {
      type: String,
      required: rqd('rollNumber'),
      trim: true,
      uppercase: true,
      match: [ROLL_RX, 'rollNumber must be alphanumeric and exactly 8 to 10 characters']
    },
    eventType: {
      type: String,
      required: rqd('eventType'),
      enum: {
        values: EVT_LIST,
        message: `eventType must be one of: ${EVT_LIST.join(', ')}`
      }
    },
    teamSize: {
      type: Number,
      required: rqd('teamSize'),
      min: [1, 'teamSize must be at least 1'],
      max: [4, 'teamSize cannot exceed 4'],
      validate: {
        validator: (v) => Number.isInteger(v),
        message: 'teamSize must be an integer'
      }
    },
    ticketPrice: {
      type: Number,
      required: rqd('ticketPrice'),
      min: [0, 'ticketPrice cannot be negative']
    },
    discountCode: {
      type: String,
      trim: true,
      uppercase: true
    },
    finalAmount: {
      type: Number
    },
    status: {
      type: String,
      enum: {
        values: STS_LIST,
        message: `status must be one of: ${STS_LIST.join(', ')}`
      },
      default: 'PENDING'
    },
    registrationDate: {
      type: Date,
      default: Date.now,
      validate: {
        validator: (v) => v.getTime() <= Date.now(),
        message: 'registrationDate cannot be a future date'
      }
    }
  },
  { versionKey: false }
);

sch.pre('validate', async function () {
  if (this.eventType === 'AI_WORKSHOP' && this.teamSize > 1) {
    this.invalidate('teamSize', 'AI Workshop only permits individual registrations', this.teamSize);
  }

  const pr = this.ticketPrice;
  if (typeof pr !== 'number' || Number.isNaN(pr)) return;

  const cd = this.discountCode;

  if (!cd) {
    this.finalAmount = pr;
  } else if (cd === 'CAMPUS50') {
    this.finalAmount = pr * 0.5;
  } else if (cd === 'EARLYBIRD') {
    this.finalAmount = Math.max(pr - 100, 0);
  } else {
    this.invalidate('discountCode', 'Invalid discount code', cd);
  }
});

const Reg = mg.model('Registration', sch);

const rt = ex.Router();

rt.post(
  '/',
  wr(async (rq, rs) => {
    const dc = await Reg.create(pk(rq.body || {}, EDIT_KEYS));
    rs.status(201).json({ success: true, message: 'Registration successful', data: dc });
  })
);

rt.get(
  '/',
  wr(async (rq, rs) => {
    const fl = {};
    if (rq.query.eventType !== undefined) fl.eventType = String(rq.query.eventType).toUpperCase();
    if (rq.query.status !== undefined) fl.status = String(rq.query.status).toUpperCase();
    const lst = await Reg.find(fl).sort({ registrationDate: -1 });
    rs.status(200).json({ success: true, count: lst.length, data: lst });
  })
);

rt.get(
  '/:id',
  wr(async (rq, rs) => {
    chkId(rq.params.id);
    const dc = await Reg.findById(rq.params.id);
    if (!dc) throw new HttpFail(404, 'Registration not found');
    rs.status(200).json({ success: true, data: dc });
  })
);

rt.put(
  '/:id',
  wr(async (rq, rs) => {
    chkId(rq.params.id);

    const cur = await Reg.findById(rq.params.id);
    if (!cur) throw new HttpFail(404, 'Registration not found');

    const pt = pk(rq.body || {}, EDIT_KEYS);
    if (Object.keys(pt).length === 0) throw new HttpFail(400, 'No updatable fields provided');

    const mx = { ...cur.toObject(), ...pt };
    delete mx._id;
    delete mx.finalAmount;

    const tmp = new Reg(mx);
    await tmp.validate();
    mx.finalAmount = tmp.finalAmount;

    const upd = await Reg.findByIdAndUpdate(rq.params.id, mx, {
      new: true,
      runValidators: true
    });
    if (!upd) throw new HttpFail(404, 'Registration not found');

    rs.status(200).json({ success: true, message: 'Registration updated', data: upd });
  })
);

rt.delete(
  '/:id',
  wr(async (rq, rs) => {
    chkId(rq.params.id);
    const gone = await Reg.findByIdAndDelete(rq.params.id);
    if (!gone) throw new HttpFail(404, 'Registration not found');
    rs.status(200).json({ success: true, message: 'Registration cancelled', data: gone });
  })
);

const ap = ex();

ap.use(ex.json());
ap.use('/api/registrations', rt);

ap.use((rq, rs) => {
  rs.status(404).json({ success: false, message: 'Route not found' });
});

ap.use((er, rq, rs, nx) => {
  if (er && er.code === 11000) {
    return rs.status(409).json({
      success: false,
      message: 'This email is already registered for the event'
    });
  }

  if (er && er.name === 'ValidationError') {
    const lst = Object.values(er.errors).map((x) =>
      x.name === 'CastError' ? `${x.path} has an invalid value` : x.message
    );
    return rs.status(400).json({ success: false, message: 'Validation failed', errors: lst });
  }

  if (er && er.name === 'CastError') {
    const ms = er.path === '_id' ? 'Invalid registration ID format' : `${er.path} has an invalid value`;
    return rs.status(400).json({ success: false, message: ms });
  }

  if (er && er.type === 'entity.parse.failed') {
    return rs.status(400).json({ success: false, message: 'Invalid JSON body' });
  }

  if (er instanceof HttpFail) {
    return rs.status(er.sc).json({ success: false, message: er.message });
  }

  console.error(er);
  return rs.status(500).json({ success: false, message: 'Internal server error' });
});

mg.connect(DB_URL)
  .then(() => Reg.init())
  .then(() => {
    ap.listen(PORT_NO, () => console.log(`Server running on port ${PORT_NO}`));
  })
  .catch((er) => {
    console.error(er);
    process.exit(1);
  });
