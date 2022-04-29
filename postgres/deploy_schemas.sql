-- DEPLOY FRESH DB TABLES
\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'
-- INSERT SEED DATA
\i '/docker-entrypoint-initdb.d/seed/seed.sql'
