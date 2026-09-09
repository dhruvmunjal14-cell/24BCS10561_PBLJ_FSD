//Ques 1. Convert names to uppercase
const arr = ["alice", "bob", "charlie"];

const res = arr.map((a) => a.toUpperCase());
console.log(res);
 console.log();

//Ques 2. Get names of people older than 18
const users = [
     
  { name: "john", age:  25 },
  { name: "jane", age: 17 },
  { name: "alex", age: 32 },
  { name: "mia", age: 15 },
 ];

const ans = users.filter((user) => user.age > 18);

console.log(ans);
console.log();

//Ques 3. Calculate total price of products in cart
const cart = 
[
  { name: "laptop", price: 10000 },
  { name: "mouse", price: 1000 },
  { name: "keyboard", price: 1200 },
];

const total = cart.reduce((sum, curr) => sum + curr.price, 0);
console.log(total);
console.log();

//Ques 4. Get full names
  const people = [
  { first: "john", last: "doe" },
  { first: "anna", last: "smith" },
];

const fullName = people.map((it) => it.first + " " + it.last);

console.log(fullName);
console.log();

//Ques 5. Get expensive in-stock products names (price > 1000 and inStock)

const items = [
  { name: "iphone", price: 1200, inStock: true },
  { name: "macbook", price: 1800, inStock: false },
  { name: "ipad", price: 250, inStock: true },
  { name: "ipad pro", price: 1100, inStock: true },
];

const names = items

  .filter((item) => item.price > 1000 && item.inStock)
  .map((item) => item.name);
console.log(names);
console.log();

//Ques 6. Get names of students who scored above 80 and calculate their average score
const students =  [
  { name: "riya",  score: 92 },
  { name: "aman", score: 78 },
  { name: "sneha", score: 88 },
  { name: "karan", score: 65 },
  { name: "priya", score: 95 },
];

const above80 = students.filter((stud) => stud.score > 80);

const above80Names = above80.map((stud) => stud.name);
const sum = above80.reduce((sum, curr) => sum + curr.score, 0);

const avg = sum / above80.length;

console.log(above80Names);
console.log(avg);
console.log();

//Ques 7. Calculate total cost after applying 20% discount on all items that cost more than 1500
const items2 = [
  { name: "Smartphone", price: 32000 },
  { name: "Charger", price: 1200 },
  { name: "Headphones", price: 4500 },
  { name: "Power Bank", price: 1800 },
];

const expItems = items2.filter((item) => item.price > 1500);

const afterDiscount = expItems.map((item) => item.price - 0.2 * item.price);

const totalPrice = afterDiscount.reduce((sum, curr) => sum + curr, 0);
console.log(totalPrice);
console.log();

//Ques 8 Get full product names with brand and calculate total stock value (price × quantity)
const products = [
  { brand: "Samsung", model: "S23", price: 72000, quantity: 5 },
  { brand: "Apple", model: "iPhone 14", price: 89000, quantity: 2 },
  { brand: "OnePlus", model: "Nord 3", price: 32000, quantity: 8 },
];

const prodNames = products.map((item) => item.brand + " " + item.model);
console.log(prodNames);

const totalVal = products.reduce(
  (sum, curr) => sum + curr.price * curr.quantity,
  0,
);
console.log("totalValue = " + totalVal);
console.log();

//Ques 9 Get names of employees who work in "Engineering" department and have salary > 1200000, then find total salary
const employees = [
  { name: "Vikram", department: "Engineering", salary: 1800000 },
  { name: "Neha", department: "Marketing", salary: 950000 },
  { name: "Arjun", department: "Engineering", salary: 1350000 },
  { name: "Pooja", department: "Engineering", salary: 980000 },
];

const eng = employees.filter(
  (emp) => emp.department == "Engineering" && emp.salary > 1200000,
);

const res1 = eng.map((emp) => emp.name);

console.log(res1);

const res2 = eng.reduce((sum, curr) => sum + curr.salary, 0);
console.log(res2);
console.log();

// Ques 10 Filter products that are in stock, apply 15% discount, then calculate final cart total
const cart2 = [
  { name: "Monitor", price: 14500, inStock: true },
  { name: "Keyboard", price: 3200, inStock: false },
  { name: "Mouse", price: 1800, inStock: true },
  { name: "Webcam", price: 4200, inStock: true },
];

const inStock2 = cart2.filter((item) => item.inStock);

const pricesAfterDisc = inStock2.map((item) => item.price * 0.85);

const totalAfterDisc = pricesAfterDisc.reduce((sum, curr) => sum + curr, 0);
console.log(totalAfterDisc);
console.log();

// Ques 11 Get names (in uppercase) of users who are active and above 21 years old, then count them
const users2 = [
  { name: "rahul", age: 19, active: true },
  { name: "simran", age: 24, active: true },
  { name: "aditya", age: 32, active: false },
  { name: "kavya", age: 22, active: true },
];

const activeUsers = users2.filter((user) => user.age > 21 && user.active);

const upperNames = activeUsers.map((user) => user.name.toUpperCase());

const count = activeUsers.length;

console.log(upperNames);
console.log(count);
console.log();

//Ques 12 Get names of winning players (score > 150) with their score in format "Name (score)", and calculate total winning score
const players = [
  { name: "Rohit", score: 168 },
  { name: "Virat", score: 142 },
  { name: "Shubman", score: 185 },
  { name: "Ishan", score: 134 },
];

const winners = players.filter((player) => player.score > 150);
const winnerNames = winners.map((player) => `${player.name} (${player.score})`);
const winnerScore = winners.reduce((sum, curr) => sum + curr.score, 0);

console.log(winnerNames);
console.log(winnerScore);