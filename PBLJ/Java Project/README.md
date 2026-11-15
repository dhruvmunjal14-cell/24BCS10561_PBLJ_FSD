# Foodies — Online Food Ordering System

Foodies is a customer-facing online food ordering web application built as an undergraduate CSE project for **Advanced Database Management Systems (ADBMS)** and **Full Stack Java**. Customers can register, sign in, browse restaurants and menus, search dishes, maintain a persistent cart, check out with simulated payment options, and inspect their order history.

> **Scope note:** By design, Foodies is strictly customer-facing and does **not** include an admin dashboard or admin panel.

---

## Technology Stack

- **Frontend:** React 19, Vite, JavaScript, React Router, Plain CSS (`Nunito Sans`, warm white & orange theme)
- **Backend:** Java 21+, Spring Boot 3.5, Spring JDBC (`JdbcTemplate`), Spring Web REST APIs, `BCryptPasswordEncoder`
- **Database:** PostgreSQL 18 (managed via **pgAdmin** or `psql`)
- **Connectivity:** JDBC (`org.postgresql:postgresql`)

---

## Project Structure

```text
Foodies/
├── database/
│   ├── schema.sql                # 8 PostgreSQL tables, constraints, indexes
│   ├── seed.sql                  # 8 Indian restaurants & 51 realistic dishes
│   ├── adbms_features.sql        # Views, PL/pgSQL triggers & stored procedures
│   └── example_queries.sql       # Joins, nested queries, COMMIT/ROLLBACK demos
├── backend/
│   ├── pom.xml                   # Maven dependencies (Web, JDBC, Validation, PostgreSQL, Crypto)
│   └── src/
│       ├── main/java/com/foodies/
│       │   ├── FoodiesApplication.java
│       │   ├── config/           # CORS & BCrypt password encoder
│       │   ├── controller/       # REST endpoints + HttpSession helper
│       │   ├── dto/              # Validated request/response objects
│       │   ├── exception/        # Global JSON error handling
│       │   ├── model/            # Plain Java models mapping DB tables
│       │   ├── repository/       # JdbcTemplate DAOs with explicit SQL & RowMappers
│       │   └── service/          # Business rules & @Transactional checkout
│       └── test/java/com/foodies/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js            # Proxies /api requests to http://localhost:8080
│   ├── public/images/            # Local food photography + SVG fallback
│   └── src/
│       ├── components/           # Navbar, Footer, Cards, Native <dialog>, ProtectedRoute
│       ├── context/              # AuthContext & CartContext
│       ├── pages/                # Home, Restaurants, Menu, Login, Register, Cart, Checkout, Orders
│       ├── services/             # native fetch() API wrappers with credentials: 'include'
│       ├── styles/               # Plain CSS layers (variables, global, components, pages)
│       └── utils/                # INR currency, date, status & image helpers
├── README.md
├── DATABASE_DOCUMENTATION.md
├── ADBMS_DOCUMENTATION.md
├── API_DOCUMENTATION.md
├── VIVA_PREPARATION.md
└── TEAM_DIVISION.md
```

---

## Setup & Running Locally

### 1. PostgreSQL Database Setup (using pgAdmin or `psql`)

1. Open **pgAdmin** (or `psql`) and verify your PostgreSQL server is running on port `5432`.
2. Create a new database named `foodies_db` (without touching any existing databases):
   ```sql
   CREATE DATABASE foodies_db;
   ```
3. Connect to `foodies_db` and run the SQL scripts in this exact order:
   1. `database/schema.sql`
   2. `database/seed.sql`
   3. `database/adbms_features.sql`
4. Optionally run queries from `database/example_queries.sql` in pgAdmin's Query Tool to verify joins, views, nested queries, and triggers.

Using `psql` from PowerShell:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -c "CREATE DATABASE foodies_db;"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d foodies_db -f database\schema.sql
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d foodies_db -f database\seed.sql
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d foodies_db -f database\adbms_features.sql
```

### 2. Backend Setup (Spring Boot + JDBC)

Set your PostgreSQL password in the environment (`DB_PASSWORD`), or configure `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/${DB_NAME:foodies_db}
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
```

Run using Maven (or open `backend/pom.xml` in IntelliJ IDEA and run `FoodiesApplication`):
```powershell
$env:DB_PASSWORD = "your_postgres_password"
$env:JAVA_HOME = "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.4\jbr"
& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.4\plugins\maven\lib\maven3\bin\mvn.cmd" -f backend\pom.xml spring-boot:run
```
The backend REST API starts at `http://localhost:8080`.

### 3. Frontend Setup (React + Vite)

```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. Vite proxies `/api/*` requests directly to `http://localhost:8080`, preserving the `FOODIES_SESSION` cookie seamlessly.

---

## Key Customer Features

- **Customer Authentication:** Registration with BCrypt password hashing, duplicate-email protection, session login/logout, and persistent sessions across refreshes.
- **Restaurant & Menu Browsing:** Search by restaurant name, cuisine, or dish name; filter by popular cuisines; toggle Veg-only dishes and jump between menu categories.
- **Persistent Cart & Single-Restaurant Rule:** Cart items are stored in PostgreSQL `cart_items`. Adding a dish from a different restaurant opens an accessible modal asking whether to replace the existing cart.
- **Authoritative Server-Side Checkout:** Subtotal, delivery fee, and final total are always recalculated from PostgreSQL inside a Spring `@Transactional` method, which inserts into `orders` and `order_items`, calls `sp_record_payment_and_clear_cart(...)`, and triggers `trg_orders_audit_log`.
- **Order History:** Displays previous orders, restaurant details, item snapshots, payment status, and order lifecycle badges (`PLACED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`).

