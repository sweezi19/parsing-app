const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path = require('path');

const productRoutes = require('./api/routes/products');
const userRoutes = require('./api/routes/user');
const parserRoutes = require('./api/routes/parser');
const homeRoutes = require('./api/routes/home');

mongoose.connect('mongodb://localhost:27017/', {useNewUrlParser: true});

mongoose.Promise = global.Promise;

app.set('views', './views')
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/user", userRoutes);

app.use("/parser", parserRoutes);
app.use("/", homeRoutes); 

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;