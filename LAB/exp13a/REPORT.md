# Experiment 13 A Report

## Objective

Learn MongoDB, Mongoose and Express by building a simple user registration and login system.

## Work Completed

1. Created the project with `npm init -y` and installed `express` and `mongoose`.
2. Connected to local MongoDB with `mongoose.connect('mongodb://localhost:27017/userdb')`.
3. Defined a `userSchema` with `username` and `email` (required, unique), `password` (required) and `createdAt` (defaults to `Date.now`).
4. Created the `User` model. Mongoose stores it in the `users` collection.
5. Added the routes:
   - `GET /` — HTML page with signup, login and "show users" forms
   - `POST /signup` — `new User({...}).save()`; error code `11000` reports a duplicate username or email
   - `POST /login` — `User.findOne({ username })`, then compares the password
   - `GET /users` — `User.find()` lists every registered user

### Results observed

```
Server running on http://localhost:3000
Connected to MongoDB successfully
```

| Action | Result |
|--------|--------|
| View users before any signup | "No users registered yet" |
| Sign up a new user | "User registered successfully!" with the username and email |
| Sign up the same user again | "Error: Username or email already exists" (code 11000) |
| Log in with the correct password | "Login successful! Welcome back, …" with email and creation date |
| Log in with a wrong password | "Incorrect password" |
| Log in with an unknown username | "User not found" |
| View users | List with username, email and join date |

The `users` collection had three indexes: `_id_`, `username_1` and `email_1`. Mongoose created the last two from `unique: true`.

## Conclusion

Mongoose gives MongoDB documents a structure: the schema defines fields, types, required values and unique indexes, and the model provides `save()`, `find()` and `findOne()`. All database calls are asynchronous, so the routes use `async/await` inside `try/catch`. Passwords are stored as plain text here only for learning. A real app should hash them with bcrypt.
