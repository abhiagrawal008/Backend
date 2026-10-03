# Experiment 14 Report

## Objective

Compare a relational database (PostgreSQL) with a document database (MongoDB) by doing the same student-management CRUD tasks in both, and see how PostgreSQL's `jsonb` type adds document-style flexibility to a relational table.

## Work Completed

### PostgreSQL

1. Installed PostgreSQL 16 with Homebrew and started it as a service (`pg_isready` → `/tmp:5432 - accepting connections`).
2. Created the database `student_management` and the table `students(id, name, branch, email, enrollment_date)` with an identity primary key and a `UNIQUE` email.
3. Inserted 5 students.
4. Ran the required queries:

| Task | SQL | Rows |
|------|-----|------|
| Students in CSE | `WHERE branch = 'CSE'` | Alice, Carla, Ethan (3) |
| Enrolled after Jan 2024 | `WHERE enrollment_date > '2024-01-31'` | Carla, Ethan (2) |
| Update a branch | `UPDATE … SET branch = 'AI/ML' WHERE email = 'bilal@example.com'` | `UPDATE 1` |
| Delete a record | `DELETE … WHERE email = 'divya@example.com'` | `DELETE 1` |
| Students per branch | `GROUP BY branch` | CSE 3, AI/ML 1 |

5. Added a `profile JSONB` column, queried it with `->`, `->>` and `@>`, and created a GIN index `idx_students_profile`.

Full output: [output/postgres_output.txt](output/postgres_output.txt)

### MongoDB

1. Used the local MongoDB service (`mongodb-community`).
2. Created the `students` collection in the `student_management` database with `insertMany` (5 documents; one has a nested `profile`), plus a unique index on `email`.
3. Ran the same operations: `find({ branch: 'CSE' })`, `find({ enrollment_date: { $gt: … } })`, `updateOne(… { $set: { branch: 'AI/ML' } })`, `deleteOne(…)`, and an aggregation pipeline (`$group` + `$sort`).
4. Queried a nested field with dot notation: `find({ 'profile.clubs.coding': true })`.

Full output: [output/mongo_output.txt](output/mongo_output.txt)

## Comparison of the experience

| Aspect | PostgreSQL | MongoDB |
|--------|------------|---------|
| Setup before inserting | Must `CREATE DATABASE` and `CREATE TABLE` with column types first | Database and collection are created automatically on the first insert |
| Inserting | `INSERT … VALUES (…)`; rows must match the columns | `insertMany([{…}])`; each document can have different fields (Ethan has a `profile`, others don't) |
| Data integrity | Types, `NOT NULL` and `UNIQUE` are enforced by the table | No schema by default; uniqueness needs an explicit `createIndex(…, { unique: true })` |
| Querying | Declarative SQL (`WHERE`, `GROUP BY`, `ILIKE`) | JSON-style filters (`{ $gt: … }`) and aggregation pipelines |
| Dates | `DATE` column; compare with `'2024-01-31'` | Must use `new Date(…)` objects, otherwise dates are just strings |
| Nested data | `jsonb` column + `->`, `->>`, `@>` and a GIN index | Native; dot notation like `'profile.clubs.coding'` |
| Output | Neat tables with row counts (`UPDATE 1`, `DELETE 1`) | JSON documents with `acknowledged`, `matchedCount`, `deletedCount` |

**Takeaway:** MongoDB was faster to start with: no schema and nested data out of the box. PostgreSQL needed more setup but caught bad data through types and constraints. Its `jsonb` column gave the same nested-field flexibility, so for this use case (fixed core fields plus a few flexible extras) one PostgreSQL table can replace a separate MongoDB database.

## Conclusion

Both databases handled every CRUD task. PostgreSQL suits structured, related data that needs integrity, joins and transactions. MongoDB suits data whose shape varies between records. `jsonb` gives PostgreSQL a bit of both.
