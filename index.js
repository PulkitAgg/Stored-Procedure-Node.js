const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
var app = express();
var query = require('./procedure.js').query;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: 'testsql'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
console.log('yuppppppp---', query)

// Running the script for stored procedures.
for(var i = 0; i < query.length; i++) {
        console.log(query[i]);
    con.query(query[i], function (err, rows, fields) {
        if (!err) {
            console.log("success"); //emails succeeds, as do other create table commands
        } else {
            console.log('Error while performing Query.'); //any queries that create stored procedures fail
            console.log(err.code);
            console.log(err.message);}
    });
}


// Cretaing the db.
app.get('/createdb', (req, res) => {
    if (req.query && req.query.dbname) {
        const query = `CREATE DATABASE ${req.query.dbname}`;
        con.query(query, (err, result) => {
            if (err) {
                res.json({
                    error: true,
                    errorMessage: err
                })
            } else {
                res.json({
                    success: true,
                    data: 'Create db successfully',
                    result
                })
            }
        })
    } else {
        res.json({
            error: true,
            errorMessage: 'Db name is missing'
        })
    }
});


// Creating the table
app.get('/createtable', (req, res) => {
    if (req.query && req.query.tbname) {
        const query = `CREATE TABLE ${req.query.tbname} (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))`;
        con.query(query, (err, result) => {
            if (err) {
                res.json({
                    error: true,
                    errorMessage: err
                })
            } else {
                res.json({
                    success: true,
                    data: 'table created successfully',
                    result
                })
            }
        })
    } else {
        res.json({
            error: true,
            errorMessage: 'table name is missing'
        })
    }
});


// Insert into table
app.post('/customerInsert', (req, res) => {
    console.log('req.body', req.body)
    const dbData = {
        name: req.body.name,
        address: req.body.address
    }
    if (dbData.name && dbData.address) {
        const query = `INSERT INTO customers (name, address) VALUES ('${dbData.name}', '${dbData.address}')`;
        con.query(query, (err, result) => {
            if (err) {
                res.json({
                    error: true,
                    errorMessage: err
                })
            } else {
                res.json({
                    success: true,
                    data: 'insert data successfully',
                    result
                })
            }
        })
    } else {
        res.json({
            error: true,
            errorMessage: 'Required fileds are missing'
        })
    }
});

// Get customer data
app.get('/customerData', (req, res) => {

    const query = `SELECT * FROM customers`;
    con.query(query, (err, result, fields) => {
        if (err) {
            res.json({
                error: true,
                errorMessage: err
            })
        } else {
            res.json({
                success: true,
                data: 'Data of customer table',
                result,
                fields
            })
        }
    })
});

// Get customer data by name
app.get('/customerData/:name', (req, res) => {

    const query = `SELECT * FROM customers WHERE name = ?`;
    con.query(query,[req.params.name], (err, result, fields) => {
        if (err) {
            res.json({
                error: true,
                errorMessage: err
            })
        } else {
            res.json({
                success: true,
                data: 'Data of customer table',
                result,
                // fields
            })
        }
    })
});


// Get customer data by name using procedure.
app.get('/getcustomerData/:name', (req, res) => {

    const query = `CALL getCustomerDataByName(?)`;
    con.query(query,[req.params.name], (err, result, fields) => {
        if (err) {
            res.json({
                error: true,
                errorMessage: err
            })
        } else {
            res.json({
                success: true,
                data: 'Data of customer table',
                result,
                // fields
            })
        }
    })
});

app.listen(3000, () => {
    console.log('Server listen on 3000 port')
})