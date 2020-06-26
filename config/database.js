const pgp = require('pg-promise')();

//server dev prod
// const connection = {
//     host: '10.1.19.80',
//     port: 5432,
//     database: 'nswdb',
//     user: 'nsw.ro',
//     password: 'morningcoffee',
//     max: 10000 // use up to 30 connections
//};

//localhost db
const connection = {
    host: 'localhost',
    port: 5432,
    database: 'nswdb',
    user: 'postgres',
    password: 'kirara@123',
    max: 10000 
};

const db = pgp(connection);

module.exports = db;