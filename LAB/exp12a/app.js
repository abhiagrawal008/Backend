const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

// ============================================
// PART A: Express basics and response methods
// ============================================

app.get('/', (req, res) => {
  res.send('Welcome to Express Server!');
});

app.get('/text', (req, res) => {
  res.send('This is plain text response');
});

app.get('/html', (req, res) => {
  res.send('<h1>HTML Response</h1><p>This is HTML content</p>');
});

app.get('/json', (req, res) => {
  res.json({
    message: 'This is JSON response',
    status: 'success',
    data: { name: 'Student', course: 'Backend Development' }
  });
});

app.get('/status', (req, res) => {
  res.status(201).json({ message: 'Created successfully' });
});

// ============================================
// PART B: URL parameters, query strings and POST data
// ============================================

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: 'User details', userId: userId });
});

app.get('/product/:category/:id', (req, res) => {
  const { category, id } = req.params;
  res.json({ category: category, productId: id });
});

app.get('/search', (req, res) => {
  const { q, page, limit } = req.query;
  res.json({
    searchQuery: q,
    page: page || 1,
    limit: limit || 10
  });
});

app.get('/calculate', (req, res) => {
  const { num1, num2, operation } = req.query;
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  let result;
  switch (operation) {
    case 'add': result = n1 + n2; break;
    case 'subtract': result = n1 - n2; break;
    case 'multiply': result = n1 * n2; break;
    case 'divide': result = n2 !== 0 ? n1 / n2 : 'Error: Division by zero'; break;
    default: result = 'Invalid operation';
  }

  res.json({ num1: n1, num2: n2, operation, result });
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  res.json({
    message: 'Registration successful',
    user: { username, email }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'test@example.com' && password === 'password123') {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'sample-jwt-token'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// ============================================
// PART C: EJS templating
// ============================================

app.get('/home', (req, res) => {
  res.render('home', {
    title: 'Home Page',
    heading: 'Welcome to EJS Templating',
    message: 'EJS makes it easy to generate dynamic HTML'
  });
});

app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  res.render('users', { users });
});

app.get('/profile/:id', (req, res) => {
  const user = {
    id: req.params.id,
    name: 'John Doe',
    email: 'john@example.com',
    age: 25,
    city: 'New York'
  };
  res.render('profile', { user });
});

// ============================================
// LAB TASK 1: Basic server — my details as text, HTML and JSON
// ============================================

const me = {
  name: 'Abhi Kumar Agrawal',
  sapId: '590014564',
  branch: 'B.Tech CSE'
};

app.get('/me/text', (req, res) => {
  res.type('text/plain').send(`Name: ${me.name}, SAP ID: ${me.sapId}, Branch: ${me.branch}`);
});

app.get('/me/html', (req, res) => {
  res.send(`
    <h1>${me.name}</h1>
    <p><strong>SAP ID:</strong> ${me.sapId}</p>
    <p><strong>Branch:</strong> ${me.branch}</p>
  `);
});

app.get('/me/json', (req, res) => {
  res.json(me);
});

// ============================================
// LAB TASK 2: Calculator API (add, subtract, multiply, divide, modulus, power)
// e.g. /calculator?num1=2&num2=10&operation=power
// ============================================

app.get('/calculator', (req, res) => {
  const { num1, num2, operation } = req.query;
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (Number.isNaN(n1) || Number.isNaN(n2)) {
    return res.status(400).json({ error: 'num1 and num2 must be numbers' });
  }

  let result;
  switch (operation) {
    case 'add': result = n1 + n2; break;
    case 'subtract': result = n1 - n2; break;
    case 'multiply': result = n1 * n2; break;
    case 'divide':
      if (n2 === 0) return res.status(400).json({ error: 'Division by zero' });
      result = n1 / n2;
      break;
    case 'modulus':
      if (n2 === 0) return res.status(400).json({ error: 'Modulus by zero' });
      result = n1 % n2;
      break;
    case 'power': result = n1 ** n2; break;
    default:
      return res.status(400).json({
        error: 'Invalid operation',
        allowed: ['add', 'subtract', 'multiply', 'divide', 'modulus', 'power']
      });
  }

  res.json({ num1: n1, num2: n2, operation, result });
});

// ============================================
// LAB TASK 3: Student management
// ============================================

const students = [
  { id: 1, name: 'Aarav Mehta', branch: 'CSE', semester: 5 },
  { id: 2, name: 'Diya Sharma', branch: 'ECE', semester: 3 },
  { id: 3, name: 'Rohan Verma', branch: 'IT', semester: 5 }
];

app.get('/students', (req, res) => {
  res.json(students);
});

app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(student);
});

app.post('/students/add', (req, res) => {
  const { name, branch, semester } = req.body;
  if (!name || !branch) {
    return res.status(400).json({ error: 'name and branch are required' });
  }

  const student = {
    id: students.length ? Math.max(...students.map(s => s.id)) + 1 : 1,
    name,
    branch,
    semester: semester ? parseInt(semester) : 1
  };
  students.push(student);
  res.status(201).json({ message: 'Student added', student });
});

// ============================================
// LAB TASK 4: EJS course timetable
// ============================================

app.get('/timetable', (req, res) => {
  const timetable = [
    { day: 'Monday', time: '09:00 - 10:00', subject: 'Backend Development', faculty: 'Prof. A. Kumar' },
    { day: 'Monday', time: '10:00 - 11:00', subject: 'Database Management Systems', faculty: 'Prof. R. Singh' },
    { day: 'Tuesday', time: '09:00 - 11:00', subject: 'Backend Development Lab', faculty: 'Prof. A. Kumar' },
    { day: 'Wednesday', time: '11:00 - 12:00', subject: 'Operating Systems', faculty: 'Prof. S. Iyer' },
    { day: 'Thursday', time: '14:00 - 15:00', subject: 'Computer Networks', faculty: 'Prof. N. Gupta' },
    { day: 'Friday', time: '10:00 - 12:00', subject: 'DBMS Lab', faculty: 'Prof. R. Singh' }
  ];
  res.render('timetable', { title: 'Course Timetable', timetable });
});

// ============================================
// LAB TASK 5: EJS form handling — student registration
// ============================================

const courses = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech IT', 'BCA', 'MCA'];

app.get('/registration', (req, res) => {
  res.render('register', { courses, error: null, values: {} });
});

app.post('/registration', (req, res) => {
  const { name, email, course, semester } = req.body;

  if (!name || !email || !course || !semester) {
    return res.status(400).render('register', {
      courses,
      error: 'All fields are required.',
      values: req.body
    });
  }

  res.render('result', { student: { name, email, course, semester } });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  / - Welcome message');
  console.log('  GET  /text, /html, /json, /status - Response methods');
  console.log('  GET  /user/:id - User by ID');
  console.log('  GET  /product/:category/:id - Two route params');
  console.log('  GET  /search?q=term - Search');
  console.log('  GET  /calculate?num1=10&num2=5&operation=add');
  console.log('  POST /register - Register user (JSON)');
  console.log('  POST /login - Login user (JSON)');
  console.log('  GET  /home - EJS home page');
  console.log('  GET  /users - Users list');
  console.log('  GET  /profile/:id - User profile');
  console.log('  --- Lab tasks ---');
  console.log('  GET  /me/text, /me/html, /me/json - Task 1');
  console.log('  GET  /calculator?num1=2&num2=10&operation=power - Task 2');
  console.log('  GET  /students, /students/:id, POST /students/add - Task 3');
  console.log('  GET  /timetable - Task 4');
  console.log('  GET  /registration - Task 5 (form)');
});
