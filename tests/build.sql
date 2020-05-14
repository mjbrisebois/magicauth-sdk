CREATE TABLE IF NOT EXISTS users (
       id		integer PRIMARY KEY AUTOINCREMENT,
       email		varchar NOT NULL UNIQUE,
       magicauth_id	varchar NOT NULL UNIQUE
);
