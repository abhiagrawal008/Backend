// Experiment 14: MongoDB equivalent of the PostgreSQL student_management lab
// Run from the terminal:
//   mongosh --quiet mongo_students.js
//
// `use student_management` only works in the interactive shell, so a script selects the database like this:
db = db.getSiblingDB('student_management');

// Re-runnable: start with an empty collection
db.students.drop();

print('=== Insert students (MongoDB creates the database and collection on first insert) ===');
printjson(db.students.insertMany([
  { name: 'Alice Sharma', branch: 'CSE', email: 'alice@example.com', enrollment_date: new Date('2024-01-15') },
  { name: 'Bilal Khan',   branch: 'ECE', email: 'bilal@example.com', enrollment_date: new Date('2023-08-10') },
  { name: 'Carla Gomez',  branch: 'CSE', email: 'carla@example.com', enrollment_date: new Date('2024-03-02') },
  { name: 'Divya Nair',   branch: 'ME',  email: 'divya@example.com', enrollment_date: new Date('2023-11-20') },
  { name: 'Ethan Brooks', branch: 'CSE', email: 'ethan@example.com', enrollment_date: new Date('2024-02-18'),
    profile: { skills: ['javascript', 'node'], clubs: { coding: true } } }
]));

// Equivalent of the UNIQUE constraint on email
db.students.createIndex({ email: 1 }, { unique: true });

print('=== Students in CSE ===');
printjson(db.students.find({ branch: 'CSE' }, { _id: 0 }).toArray());

print('=== Students enrolled after Jan 2024 ===');
printjson(db.students.find({ enrollment_date: { $gt: new Date('2024-01-31') } }, { _id: 0, name: 1, enrollment_date: 1 }).toArray());

print('=== Update: move Bilal Khan to AI/ML ===');
printjson(db.students.updateOne({ email: 'bilal@example.com' }, { $set: { branch: 'AI/ML' } }));
printjson(db.students.findOne({ email: 'bilal@example.com' }, { _id: 0 }));

print('=== Delete: Carla Gomez ===');
printjson(db.students.deleteOne({ email: 'carla@example.com' }));

print('=== Students per branch (aggregation pipeline) ===');
printjson(db.students.aggregate([
  { $group: { _id: '$branch', total: { $sum: 1 } } },
  { $sort: { total: -1 } }
]).toArray());

print('=== Nested field query (same idea as JSONB @>) ===');
printjson(db.students.find({ 'profile.clubs.coding': true }, { _id: 0, name: 1, profile: 1 }).toArray());

print('=== Remaining students ===');
printjson(db.students.find({}, { _id: 0, name: 1, branch: 1, email: 1 }).toArray());
