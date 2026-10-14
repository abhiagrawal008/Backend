// Assignment 2 — Task 7: the same product catalog in MongoDB
// Name: Abhi Kumar Agrawal | SAP ID: 590014564
// Run: mongosh --quiet mongo_products.js

db = db.getSiblingDB("product_catalog");
db.products.drop();

print("=== insertMany: 5 products ===");
const res = db.products.insertMany([
  { name: "Clean Code",            category: "book",      price: 499.00,    attributes: { author: "Robert C. Martin", pages: 464 } },
  { name: "MacBook Air M3",        category: "laptop",    price: 114900.00, attributes: { ram_gb: 16, cpu: "Apple M3", storage_gb: 512 } },
  { name: "Lenovo IdeaPad Slim 3", category: "laptop",    price: 52990.00,  attributes: { ram_gb: 8, cpu: "Intel Core i5-12450H", storage_gb: 512 } },
  { name: "Wireless Mouse",        category: "accessory", price: 799.00,    attributes: { color: "black", wireless: true, dpi: 1600 } },
  { name: "USB-C Hub",             category: "accessory", price: 1499.00,   attributes: { color: "grey", wireless: false, ports: 6 } }
]);
print("inserted:", Object.keys(res.insertedIds).length);

print("=== Task 3a: books with more than 300 pages ===");
printjson(db.products.find(
  { category: "book", "attributes.pages": { $gt: 300 } },
  { _id: 0, name: 1, "attributes.author": 1, "attributes.pages": 1 }
).toArray());

print("=== Task 3b: laptops with at least 16 GB RAM ===");
printjson(db.products.find(
  { category: "laptop", "attributes.ram_gb": { $gte: 16 } },
  { _id: 0, name: 1, "attributes.cpu": 1 }
).toArray());

print("=== Task 3c: black accessories ===");
printjson(db.products.find(
  { category: "accessory", "attributes.color": "black" },
  { _id: 0, name: 1, price: 1 }
).toArray());

print("=== Task 4: wireless products (like @>) ===");
printjson(db.products.find({ "attributes.wireless": true }, { _id: 0, name: 1 }).toArray());

print("=== Key exists (like ?) ===");
printjson(db.products.find({ "attributes.author": { $exists: true } }, { _id: 0, name: 1 }).toArray());

print("=== Task 5: add discount_pct with $set (no schema change) ===");
printjson(db.products.updateOne({ name: "Wireless Mouse" }, { $set: { "attributes.discount_pct": 10 } }));
printjson(db.products.findOne({ name: "Wireless Mouse" }, { _id: 0, name: 1, attributes: 1 }));

print("=== Task 6: index on a nested field + explain ===");
print("before index:", db.products.find({ "attributes.wireless": true }).explain().queryPlanner.winningPlan.stage);
db.products.createIndex({ "attributes.wireless": 1 });
const plan = db.products.find({ "attributes.wireless": true }).explain().queryPlanner.winningPlan;
print("after index:", plan.stage, "->", plan.inputStage ? plan.inputStage.stage : "");
