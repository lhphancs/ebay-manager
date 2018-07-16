const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const products = require('./routes/products');


const app = express(express);
const port = process.env.PORT || 3000;

const mongoPath = 'mongodb://localhost:27017/ebay'
const mongoose = require('mongoose');
mongoose.connect(mongoPath);
mongoose.connection.on('connected', () => {
    console.log(`Connected to database: ${mongoPath}`);
});
mongoose.connection.on('error', (err) => {
    console.log(`Database error: ${err}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/products', products);
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

