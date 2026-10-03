# exp12a
Experiment 12 A: Node.js, npm, Express.js, Nodemon and EJS

- [Open experiment report](REPORT.md)
- Server code: [app.js](app.js) · Node script: [script.js](script.js) · Templates: [views/](views)

## How to run

```bash
npm install        # first time only
npm run script     # Step 3: plain Node.js script
npm run dev        # Express server with nodemon (auto-restart)
npm start          # Express server with node
```

Then open http://localhost:3000

## Routes

| Method | Route | Part |
|--------|-------|------|
| GET | `/`, `/text`, `/html`, `/json`, `/status` | A — response methods |
| GET | `/user/:id`, `/product/:category/:id` | B — route parameters |
| GET | `/search?q=nodejs&page=2&limit=20` | B — query parameters |
| GET | `/calculate?num1=10&num2=5&operation=add` | B — query parameters |
| POST | `/register`, `/login` | B — POST data (JSON or form) |
| GET | `/home`, `/users`, `/profile/:id` | C — EJS templates |
| GET | `/me/text`, `/me/html`, `/me/json` | Lab Task 1 |
| GET | `/calculator?num1=2&num2=10&operation=power` | Lab Task 2 (add, subtract, multiply, divide, modulus, power) |
| GET / GET / POST | `/students`, `/students/:id`, `/students/add` | Lab Task 3 |
| GET | `/timetable` | Lab Task 4 |
| GET / POST | `/registration` | Lab Task 5 (EJS form → result page) |

> Task 1 details (name, SAP ID, branch) are in the `me` object in `app.js`.

## Try the POST routes

```bash
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"john","email":"john@example.com","password":"pass123"}'
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
curl -X POST http://localhost:3000/students/add -H "Content-Type: application/json" -d '{"name":"Ishaan Rao","branch":"CSE","semester":3}'
```
