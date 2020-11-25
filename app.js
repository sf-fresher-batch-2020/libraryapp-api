const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Create Connection Pool
const mysql = require("mysql2/promise");
const { request } = require('express');

const pool = mysql.createPool({
    host: "65.0.143.230",
    port: 3306,
    user: "pavithra",
    password: "pavithra",
    database: "pavithra_db",
    connectionLimit: 10
});


// Create Routes
app.get('/api/users', getAllUsers);
app.post('/api/users', createUser);
app.post('/api/users/login', login);
//profile
app.post('/api/profiles', createProfile);
app.get('/api/profiles/:id', getProfile);
//addbook task
app.post('/api/books', books);
app.get('/api/books', getAllbooks);
app.get('/api/books/:id', getbook);
app.post('/api/books/delete', deletebook);
//borrowbook
app.get('/api/borrowbooks', borrowbooks);
app.get('/api/borrowbooks', getborrowbooks);

//signup and signin
async function createUser(req, res) {
    let user = req.body;
    let params = [user.name, user.email, user.password, user.mobileno, user.role];
    const result = await pool.query("insert into signup (name,email,password,mobileno,role) values ( ?,?,?,?,?)", params);
    res.status(201).json({ id: result[0].insertId });
}

async function getAllUsers(req, res) {
    const result = await pool.query("select id,name,email,password,mobileno,role from signup");
    // res.send({ message: result });
    res.status(200).json(result[0]);
}

async function login(req, res) {
    const user = req.body;
    let params = [user.email, user.password];
    const result = await pool.query("SELECT id, name, email FROM signup WHERE email = ? AND password = ?", params);
    if (result[0].length == 0) {
        throw new Error("Invalid Login Credentials");
    }
    res.status(201).json(result[0]);
}

//profile
async function createProfile(req, res) {
    const user = req.body;
    let params = [user.name, user.email, user.mobileno];
    const result = await pool.query("SELECT name,email,mobileno FROM signup", params);
    res.status(201).json({ id: result[0].insertId });
}

async function getProfile(req, res) {
    const id = req.params.id;
    const result = await pool.query("SELECT * FROM profiles where user_id = ?", id);
    res.status(200).json(result[0]);
}


//addbook
async function books(req, res) {
    let book = req.body;
    let params = [book.title, book.author, book.publisher, book.category];
    const result = await pool.query("INSERT INTO books (title,author,publisher,category) values (?,?,?,?)", params);
    res.status(201).json({ bookid: result[0].insertId });
}

async function getAllbooks(req, res) {
    const result = await pool.query("SELECT * from books");
    res.status(200).json(result[0]);
}
async function getbook(req, res) {
    const id = req.params.id;
    const result = await pool.query("SELECT * FROM books WHERE bookid = ?", id);
    res.status(200).json(result[0]);
}
async function deletebook(req, res) {
    const book = req.body;
    let params = [book.bookid];
    const result = await pool.query("DELETE FROM books WHERE bookid = ?", params);
    res.status(201).json(result[0].info);
}
//borrowbooks
async function borrowbooks(req, res) {
    const book = req.body;
    let params = [book.bookid, book.title, book.author, book.publisher, book.category];
    const result = await pool.query("INSERT INTO borrowbooks (bookid, title, author, publisher, category) VALUES (?,?,?,?,?)", params);
    res.status(201).json(result[0]);
}
async function getborrowbooks(req, res) {
    const result = await pool.query("SELECT * FROM borrowbooks");
    res.status(200).json(result[0]);
}


app.use(function(err, req, res, next) {
    console.log("common error handler");
    console.error(err);
    res.json({ errorMessage: err.message });
});
app.listen(port, () => console.log(`app listening on port ${port}`));