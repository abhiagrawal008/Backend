# exp14
Experiment 14 (Optional): Relational vs document databases — PostgreSQL and MongoDB

- [Open experiment report](REPORT.md)
- PostgreSQL script: [student_management.sql](student_management.sql) → output: [output/postgres_output.txt](output/postgres_output.txt)
- MongoDB script: [mongo_students.js](mongo_students.js) → output: [output/mongo_output.txt](output/mongo_output.txt)

## Setup (macOS, already done on this machine)

```bash
brew install postgresql@16
brew services start postgresql@16
pg_isready
```

`postgresql@16` is keg-only, so its tools are not on the PATH by default. Either use the full path `/opt/homebrew/opt/postgresql@16/bin/psql`, or add it to your shell once:

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

On Homebrew the superuser is your macOS user (not `postgres`), so `psql -d postgres` works without `sudo -u postgres`.

## How to run

```bash
psql -d postgres -f student_management.sql   # recreates student_management and runs every query
mongosh --quiet mongo_students.js            # recreates the students collection in MongoDB
```

Explore interactively:

```bash
psql student_management       # then: \dt, \d students, SELECT * FROM students;
mongosh student_management    # then: db.students.find()
```
