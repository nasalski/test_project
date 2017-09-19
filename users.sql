DROP DATABASE IF EXISTS db_users;
CREATE DATABASE db_users;

\c db_users;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  role VARCHAR,
  age INTEGER,
  foto VARCHAR
);

INSERT INTO users (name, role, age, foto)
  VALUES ('Tyler', 'admin', 20, ' ');