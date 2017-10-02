DROP DATABASE IF EXISTS db_users;
CREATE DATABASE db_users;

\c db_users;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  firstname VARCHAR,
  lastname VARCHAR,
  role VARCHAR,
  domain VARCHAR,
  log_time VARCHAR,
  foto VARCHAR,
  email VARCHAR,
  password VARCHAR
);

INSERT INTO users (firstname, lastname, role, domain,log_time, foto, email, password)
  VALUES ('Tyler','Logan', 'admin', 'Nexus',' ', ' ', 'wwwasd@gmail.com', 'qwerty');
  
  CREATE TABLE keys (
  email VARCHAR,
  key INTEGER,
  dat date
);