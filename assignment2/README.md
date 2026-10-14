# Assignment 2 — PostgreSQL as SQL + NoSQL: Working with JSONB

**Name:** Abhi Kumar Agrawal  
**SAP ID:** 590014564  
**Course:** Backend Development

- [Open the assignment submission](590014564_assignment2.md). It contains the Part A concept answers and the Part B product catalog work.
- The PostgreSQL script is [product_catalog.sql](product_catalog.sql). Its output is in [output/postgres_output.txt](output/postgres_output.txt).
- The MongoDB script for the Task 7 comparison is [mongo_products.js](mongo_products.js).

## Summary

| Part | What was done |
|------|---------------|
| A1 | `json` vs `jsonb`: storage, write speed, query and index speed |
| A2 | One table that mixes typed SQL columns with a `jsonb` column |
| A3 | The `->`, `->>`, `@>` and `?` operators with real returned values |
| A4 | GIN index: which queries it speeds up and which it does not |
| A5 | PostgreSQL + `jsonb` vs MongoDB: transactions, joins, schema, scaling |
| B1–B2 | `products` table with 5 products in 3 categories, each with its own attribute keys |
| B3–B4 | One filter for each category, plus a containment (`@>`) query |
| B5 | Added `discount_pct` with `\|\|`, without `ALTER TABLE` |
| B6 | GIN index and `EXPLAIN ANALYZE`. On 200,000 rows the query went from 73.95 ms to 1.68 ms |
| B7 | The same data and queries in MongoDB (`insertMany`, `find`, `$set`, `createIndex`) |

## How to run

```bash
psql -d postgres -f product_catalog.sql > output/postgres_output.txt   # recreates the product_catalog database
mongosh --quiet mongo_products.js                                     # recreates product_catalog.products
```

On this Mac, PostgreSQL 16 is keg-only. Use `/opt/homebrew/opt/postgresql@16/bin/psql` if `psql` is not on the PATH (see [Experiment 14](../LAB/exp14/README.md)).
