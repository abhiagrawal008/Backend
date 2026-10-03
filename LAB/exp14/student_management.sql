-- Experiment 14: PostgreSQL — student_management
-- Run from the terminal:
--   psql -d postgres -f student_management.sql
--
-- The script is re-runnable: it recreates the student_management database from scratch.

-- ============================================
-- Module 3: Create database + table
-- ============================================
\echo '=== Create database student_management ==='
DROP DATABASE IF EXISTS student_management;
CREATE DATABASE student_management;
\c student_management

\echo '=== Create table students ==='
CREATE TABLE students (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    branch VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    enrollment_date DATE DEFAULT CURRENT_DATE
);
\d students

-- ============================================
-- Insert (Create) — at least 5 records
-- ============================================
\echo '=== Insert 5 students ==='
INSERT INTO students (name, branch, email, enrollment_date)
VALUES
    ('Alice Sharma',  'CSE', 'alice@example.com',  '2024-01-15'),
    ('Bilal Khan',    'ECE', 'bilal@example.com',  '2023-08-10'),
    ('Carla Gomez',   'CSE', 'carla@example.com',  '2024-03-02'),
    ('Divya Nair',    'ME',  'divya@example.com',  '2023-11-20'),
    ('Ethan Brooks',  'CSE', 'ethan@example.com',  '2024-02-18');

SELECT * FROM students ORDER BY id;

-- ============================================
-- Read (Retrieve)
-- ============================================
\echo '=== Students in CSE ==='
SELECT * FROM students WHERE branch = 'CSE';

\echo '=== Students enrolled after Jan 2024 ==='
SELECT * FROM students WHERE enrollment_date > '2024-01-31';

\echo '=== Case-insensitive name search (names starting with a) ==='
SELECT * FROM students WHERE name ILIKE 'a%';

-- ============================================
-- Update
-- ============================================
\echo '=== Update: move Bilal Khan to AI/ML ==='
UPDATE students
SET branch = 'AI/ML'
WHERE email = 'bilal@example.com';

SELECT * FROM students WHERE email = 'bilal@example.com';

-- ============================================
-- Delete
-- ============================================
\echo '=== Delete: check the record first, then delete Divya Nair ==='
SELECT * FROM students WHERE email = 'divya@example.com';

DELETE FROM students
WHERE email = 'divya@example.com';

SELECT * FROM students ORDER BY id;

-- ============================================
-- Aggregation (bonus)
-- ============================================
\echo '=== Students per branch ==='
SELECT branch, COUNT(*) AS total
FROM students
GROUP BY branch
ORDER BY total DESC;

-- ============================================
-- Module 5: JSONB — a flexible field on a relational table
-- ============================================
\echo '=== Add JSONB profile column ==='
ALTER TABLE students ADD COLUMN profile JSONB;

UPDATE students
SET profile = '{"skills": ["python", "sql"], "clubs": {"robotics": true}}'
WHERE email = 'alice@example.com';

UPDATE students
SET profile = '{"skills": ["javascript", "node"], "clubs": {"coding": true}}'
WHERE email = 'ethan@example.com';

\echo '=== -> returns JSON, ->> returns text ==='
SELECT name, profile -> 'skills' AS skills_json FROM students WHERE email = 'alice@example.com';
SELECT name, profile ->> 'clubs' AS clubs_text FROM students WHERE email = 'alice@example.com';

\echo '=== @> containment: who is in the robotics club? ==='
SELECT id, name, branch FROM students WHERE profile @> '{"clubs": {"robotics": true}}';

\echo '=== GIN index on profile ==='
CREATE INDEX idx_students_profile ON students USING GIN (profile);
\di
