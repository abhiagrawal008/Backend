-- Assignment 2 — PostgreSQL as SQL + NoSQL: Working with JSONB
-- Name: Abhi Kumar Agrawal | SAP ID: 590014564
-- Run: psql -d postgres -f product_catalog.sql

\echo '=== Setup: fresh database product_catalog ==='
DROP DATABASE IF EXISTS product_catalog;
CREATE DATABASE product_catalog;
\c product_catalog
SET jit = off;

-- ------------------------------------------------------------
-- Task 1 — Schema: typed columns (SQL) + one JSONB column (NoSQL)
-- ------------------------------------------------------------
\echo '=== Task 1: create table products ==='
CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    attributes JSONB
);
\d products

-- ------------------------------------------------------------
-- Task 2 — Insert 5 products in 3 categories, each with its own keys
-- ------------------------------------------------------------
\echo '=== Task 2: insert 5 products ==='
INSERT INTO products (name, category, price, attributes) VALUES
    ('Clean Code',            'book',      499.00,    '{"author": "Robert C. Martin", "pages": 464}'),
    ('MacBook Air M3',        'laptop',    114900.00, '{"ram_gb": 16, "cpu": "Apple M3", "storage_gb": 512}'),
    ('Lenovo IdeaPad Slim 3', 'laptop',    52990.00,  '{"ram_gb": 8, "cpu": "Intel Core i5-12450H", "storage_gb": 512}'),
    ('Wireless Mouse',        'accessory', 799.00,    '{"color": "black", "wireless": true, "dpi": 1600}'),
    ('USB-C Hub',             'accessory', 1499.00,   '{"color": "grey", "wireless": false, "ports": 6}');

SELECT id, name, category, price, attributes FROM products ORDER BY id;

-- ------------------------------------------------------------
-- Part A, Q3 — the four operators with their returned values
-- ------------------------------------------------------------
\echo '=== Operators: -> returns jsonb, ->> returns text ==='
SELECT attributes -> 'pages'  AS pages_jsonb,
       pg_typeof(attributes -> 'pages')  AS type_1,
       attributes ->> 'pages' AS pages_text,
       pg_typeof(attributes ->> 'pages') AS type_2
FROM products WHERE name = 'Clean Code';

\echo '=== Operator @> (containment) ==='
SELECT name FROM products WHERE attributes @> '{"cpu": "Apple M3"}';

\echo '=== Operator ? (key exists) ==='
SELECT name FROM products WHERE attributes ? 'author';

-- ------------------------------------------------------------
-- Task 3 — One query per category on a category-specific attribute
-- ------------------------------------------------------------
\echo '=== Task 3a: books with more than 300 pages ==='
SELECT name, attributes ->> 'author' AS author, (attributes ->> 'pages')::int AS pages
FROM products
WHERE category = 'book' AND (attributes ->> 'pages')::int > 300;

\echo '=== Task 3b: laptops with at least 16 GB RAM ==='
SELECT name, attributes ->> 'cpu' AS cpu
FROM products
WHERE category = 'laptop' AND (attributes ->> 'ram_gb')::int >= 16;

\echo '=== Task 3c: black accessories ==='
SELECT name, price
FROM products
WHERE category = 'accessory' AND attributes ->> 'color' = 'black';

-- ------------------------------------------------------------
-- Task 4 — Containment query
-- ------------------------------------------------------------
\echo '=== Task 4: wireless products (@>) ==='
SELECT name FROM products WHERE attributes @> '{"wireless": true}';

-- ------------------------------------------------------------
-- Task 5 — Add a new key without ALTER TABLE
-- ------------------------------------------------------------
\echo '=== Task 5: add discount_pct to Wireless Mouse with || ==='
UPDATE products
SET attributes = attributes || '{"discount_pct": 10}'
WHERE name = 'Wireless Mouse';

SELECT name, attributes FROM products WHERE name = 'Wireless Mouse';

-- ------------------------------------------------------------
-- Task 6 — GIN index and EXPLAIN ANALYZE before / after
-- ------------------------------------------------------------
\echo '=== Task 6a: EXPLAIN ANALYZE before the index (5 rows) ==='
EXPLAIN ANALYZE SELECT name FROM products WHERE attributes @> '{"wireless": true}';

CREATE INDEX idx_products_attributes ON products USING GIN (attributes);
ANALYZE products;

\echo '=== Task 6b: EXPLAIN ANALYZE after the index (5 rows) ==='
EXPLAIN ANALYZE SELECT name FROM products WHERE attributes @> '{"wireless": true}';

\echo '=== Task 6c: same query with seq scan disabled, to show the index can be used ==='
SET enable_seqscan = off;
EXPLAIN ANALYZE SELECT name FROM products WHERE attributes @> '{"wireless": true}';
RESET enable_seqscan;

\echo '=== Task 6d: ->> filter is NOT helped by the default GIN index ==='
SET enable_seqscan = off;
EXPLAIN SELECT name FROM products WHERE attributes ->> 'color' = 'black';
RESET enable_seqscan;

-- Scale test: 5 rows is too small to see a speed-up, so repeat on 200,000 rows
\echo '=== Task 6e: scale test on 200,000 generated rows ==='
CREATE TABLE products_big (LIKE products INCLUDING ALL);
INSERT INTO products_big (name, category, price, attributes)
SELECT 'Item ' || g,
       (ARRAY['book','laptop','accessory'])[1 + g % 3],
       (100 + g % 5000)::numeric,
       CASE g % 3
           WHEN 0 THEN jsonb_build_object('author', 'Author ' || (g % 500), 'pages', 100 + g % 900)
           WHEN 1 THEN jsonb_build_object('ram_gb', (ARRAY[4,8,16,32])[1 + g % 4], 'cpu', 'CPU ' || (g % 50))
           ELSE        jsonb_build_object('color', (ARRAY['black','white','grey','blue'])[1 + g % 4],
                                          'wireless', (g % 100 = 2))
       END
FROM generate_series(1, 200000) AS g;
DROP INDEX IF EXISTS products_big_attributes_idx;
ANALYZE products_big;

\echo '--- before index ---'
EXPLAIN ANALYZE SELECT count(*) FROM products_big WHERE attributes @> '{"wireless": true}';

CREATE INDEX idx_products_big_attributes ON products_big USING GIN (attributes);
ANALYZE products_big;

\echo '--- after index ---'
EXPLAIN ANALYZE SELECT count(*) FROM products_big WHERE attributes @> '{"wireless": true}';

\echo '--- index sizes ---'
SELECT relname AS index_name, pg_size_pretty(pg_relation_size(oid)) AS size
FROM pg_class WHERE relname IN ('idx_products_attributes', 'idx_products_big_attributes');

\echo '=== Final table ==='
SELECT id, name, category, price, attributes FROM products ORDER BY id;
