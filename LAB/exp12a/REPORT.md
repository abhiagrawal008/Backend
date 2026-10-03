# Experiment 12 A Report

## Objective

Understand server-side JavaScript with Node.js: manage a project with npm, build routes with Express.js, handle URL parameters, query strings and POST data, render dynamic pages with EJS, and use Nodemon during development.

## Work Completed

1. Initialised the project with `npm init -y` and installed `express` and `ejs` as dependencies and `nodemon` as a dev dependency (`npm install nodemon -D`).
2. Ran a plain Node.js script (`script.js`):
   ```
   Hello from Node.js!
   Welcome Student to Backend Development
   Sum of numbers: 15
   ```
3. Built an Express server (`app.js`) showing `res.send()`, `res.json()`, `res.status()` and `res.render()`.
4. Read route parameters with `req.params`, query strings with `req.query`, and POST bodies with `req.body` (using `express.json()` and `express.urlencoded()`).
5. Rendered EJS templates with `<%= %>` (escaped output), `<% %>` (loops and conditions), and passed data from routes.
6. Added `npm run dev` with Nodemon and a `nodemon.json` that also watches `.ejs` files.
7. Completed lab tasks 1–5 (details below).

### Results observed

| Request | Status | Response |
|---------|--------|----------|
| `GET /json` | 200 | `{"message":"This is JSON response","status":"success",...}` |
| `GET /status` | 201 | `{"message":"Created successfully"}` |
| `GET /product/electronics/456` | 200 | `{"category":"electronics","productId":"456"}` |
| `GET /search?q=nodejs&page=2&limit=20` | 200 | `{"searchQuery":"nodejs","page":"2","limit":"20"}` |
| `POST /login` (correct) | 200 | `{"success":true,"message":"Login successful",...}` |
| `POST /login` (wrong) | 401 | `{"success":false,"message":"Invalid credentials"}` |
| `GET /calculator?num1=2&num2=10&operation=power` | 200 | `result: 1024` |
| `GET /calculator?num1=17&num2=5&operation=modulus` | 200 | `result: 2` |
| `GET /calculator?num1=1&num2=0&operation=divide` | 400 | `{"error":"Division by zero"}` |
| `GET /students/99` | 404 | `{"error":"Student not found"}` |
| `POST /students/add` | 201 | `{"message":"Student added","student":{"id":4,...}}` |
| `GET /home`, `/users`, `/profile/7`, `/timetable` | 200 | Rendered EJS pages |
| `POST /registration` | 200 | Result page with the submitted name, email, course and semester |

### Lab tasks

- **Task 1:** `/me/text`, `/me/html` and `/me/json` return the same details as plain text, HTML and JSON.
- **Task 2:** `/calculator` supports add, subtract, multiply, divide, modulus and power, and returns `400` for non-numeric input, division/modulus by zero, or an unknown operation.
- **Task 3:** `/students` (list), `/students/:id` (one student or `404`) and `POST /students/add` (validates `name` and `branch`, returns `201`).
- **Task 4:** `/timetable` renders `views/timetable.ejs` with day, time, subject and faculty passed from the route.
- **Task 5:** `/registration` shows an EJS form (name, email, course, semester). The POST handler re-shows the form with an error if a field is missing, otherwise renders `views/result.ejs`. EJS escapes the input, so `<b>` typed into the name shows as text.

## Conclusion

Express keeps routing, middleware and response handling short, and EJS turns route data into HTML pages. Route parameters identify a resource, query strings carry options, and POST bodies carry submitted data. Nodemon restarts the server on every save, which speeds up development.
