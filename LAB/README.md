# LAB
Backend Development lab work

**Name:** Abhi Kumar Agrawal  
**SAP ID:** 590014564

| # | Experiment | Folder | Tech |
|---|------------|--------|------|
| 1 | [Experiment 1](exp1/README.md) | `exp1` | HTML |
| 3 | [Create a Responsive Web Page with HTML and CSS](exp3/README.md) | `exp3` | HTML5, CSS3, Flexbox, Grid, Media Queries |
| 12 A | [Node.js, npm, Express.js, Nodemon and EJS](exp12a/README.md) | `exp12a` | Node.js, Express, EJS, Nodemon |
| 13 A | [MongoDB, Mongoose and Express — User Registration and Login](exp13a/README.md) | `exp13a` | Express, Mongoose, MongoDB |
| 14 | [PostgreSQL vs MongoDB (Optional)](exp14/README.md) | `exp14` | PostgreSQL, MongoDB, SQL, JSONB |

---

## [Experiment 1](exp1/README.md)

Experiment 1

---

## [Experiment 3](exp3/README.md) — Responsive Web Page with HTML and CSS

A responsive page built without any framework: viewport meta tag, Flexbox navigation, CSS Grid cards and media queries.

- `index.html` — final page with all exercises: 4 columns above 1024px, 3 on laptops, 2 on tablets, 1 on phones; a responsive image; dark mode via `prefers-color-scheme`
- `tasks/task1.html` … `tasks/task5.html` — the page after each step of the lab sheet
- [Report](exp3/REPORT.md)

**Run:** open `exp3/index.html` in a browser and resize the window.

---

## [Experiment 12 A](exp12a/README.md) — Node.js, npm, Express.js, Nodemon and EJS

An Express server covering response methods, route and query parameters, POST data, EJS templates and Nodemon, plus all five lab tasks.

- `script.js` — basic Node.js script
- `app.js` — Express server (Parts A–C and Lab Tasks 1–5)
- `views/` — EJS templates: `home`, `users`, `profile`, `timetable`, `register`, `result`
- `nodemon.json` — watches `.js` and `.ejs` files
- [Report](exp12a/REPORT.md)

| Lab task | Route |
|----------|-------|
| 1. Name, SAP ID and branch as text / HTML / JSON | `/me/text`, `/me/html`, `/me/json` |
| 2. Calculator (add, subtract, multiply, divide, modulus, power) | `/calculator?num1=2&num2=10&operation=power` |
| 3. Student management | `GET /students`, `GET /students/:id`, `POST /students/add` |
| 4. Course timetable (EJS) | `/timetable` |
| 5. Student registration form (EJS) | `/registration` |

**Run:**

```bash
cd exp12a
npm install
npm run dev        # http://localhost:3000
```

---

## [Experiment 13 A](exp13a/README.md) — MongoDB, Mongoose and Express

A user registration and login system: Mongoose schema with unique `username` and `email`, signup, login, and a list of all users stored in the `userdb` database.

- `server.js` — Express + Mongoose app
- [Report](exp13a/REPORT.md)

**Run** (MongoDB must be running locally):

```bash
cd exp13a
npm install
npm start          # http://localhost:3000
```

---

## [Experiment 14](exp14/README.md) — PostgreSQL vs MongoDB (Optional)

The same student-management tasks in a relational and a document database: create, insert 5 records, query CSE students and those enrolled after Jan 2024, update a branch, delete a record, aggregate by branch, then use PostgreSQL `jsonb` for document-style data.

- `student_management.sql` — PostgreSQL script
- `mongo_students.js` — MongoDB (mongosh) script
- `output/` — output of both scripts
- [Report](exp14/REPORT.md) — includes the PostgreSQL vs MongoDB comparison

**Run:**

```bash
cd exp14
psql -d postgres -f student_management.sql
mongosh --quiet mongo_students.js
```
