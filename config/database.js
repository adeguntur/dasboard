const pgp = require('pg-promise')();
const connection = {
    host: '192.10.10.49',
    port: 5432,
    database: 'nswdb',
    user: 'postgres',
    password: '@dmDB123',
    max: 10000 // use up to 30 connections
};
const db = pgp(connection);

module.exports = db;