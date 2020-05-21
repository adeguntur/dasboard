const pgp = require('pg-promise')();
const connection = {
    host: 'localhost',
    port: 5432,
    database: 'nswdb',
    user: 'postgres',
    password: 'kirara@123',
    max: 10000 // use up to 30 connections
};
const db = pgp(connection);

module.exports = db;