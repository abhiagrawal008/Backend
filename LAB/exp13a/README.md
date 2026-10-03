# exp13a
Experiment 13 A: MongoDB, Mongoose and Express — user registration and login

- [Open experiment report](REPORT.md)
- Server code: [server.js](server.js)

## How to run

1. Make sure MongoDB is running locally (`brew services start mongodb-community`, or `mongod`).
2. Start the app:

```bash
npm install        # first time only
npm start
```

3. Open http://localhost:3000 to sign up, log in and list all users.

The app uses the database `userdb` and the collection `users`. Override them with environment variables if needed:

```bash
DB_URL=mongodb://localhost:27017/otherdb PORT=3001 npm start
```

Inspect the data in the Mongo shell:

```bash
mongosh userdb --eval "db.users.find()"
```

> Learning example only: passwords are stored as plain text, as in the lab sheet. Use bcrypt in a real app.
