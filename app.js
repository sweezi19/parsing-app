const parser = require('./index');
const express = require('express');
const nodemon = require('nodemon');
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser');

const User = require("./model/user");
const auth = require("./middleware/auth");
const jwt = require('jsonwebtoken');

const productSchema = new mongoose.Schema({
   title: String,
   sku: String,
   brand: String,
   price: Number,
   link: String,
   image: String,
   short_description: String,
   categories: String,
   tags: String,
   description: String,
   specifications: String
});

const app = express();

function authMiddleware(req, res, next) {
   const token = req.headers.authorization;
   if (!token) {
     return res.render('login', { notAuthorized: true });
   }
   try {
     const decoded = jwt.verify(token, process.env.TOKEN_KEY);
     req.user = decoded;
     return next();
   } catch (error) {
     return res.status(401).json({ message: 'Invalid token' });
   }
}
 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views')
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get("/", (req, res) => {
   res.render('home')
});

app.get('/parse', authMiddleware, (req, res) => {
   parser.startApp()
   res.render('parse')
});


app.get('/getData', authMiddleware, (req, res) => {
   const filter = {};

   if (req.query.sku) {
      filter.sku = req.query.sku;
   }
   if (req.query.brand) {
      filter.brand = req.query.brand;
   }
   if (req.query.price_min) {
      filter.price = { $gt: req.query.price_min };
   }
   if (req.query.price_max) {
      filter.price = { $lt: req.query.price_max };
   }

   parser.Product.find(filter, (err, products) => {
      if (err) {
         res.send(err);
      } else {
         res.render('products', { products: products });
      }
   });
});

app.get('/register', (req, res) => {
   res.render('register')
})

app.get('/login', (req, res) => {
   res.render('login')
})

app.post("/register", async (req, res) => {

   try {
     const { first_name, last_name, email, password } = req.body;
 
     if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
     }
 
     const oldUser = await User.findOne({ email });
 
     if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
     }

     encryptedPassword = await bcrypt.hash(password, 10);
 
     const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
     });
 
     const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
      expiresIn: "2h",
      }
     );
     user.token = token;
 
     res.status(201).json(user);
   } catch (err) {
     console.log(err);
   }
});

app.post("/login", async (req, res) => {

   try {
     const { email, password } = req.body;
 
     if (!(email && password)) {
      res.status(400).send("All input is required");
     }
     const user = await User.findOne({ email });
 
     if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
         { user_id: user._id, email },
         process.env.TOKEN_KEY,
         {
           expiresIn: "2h",
         }
      );
 
      user.token = token;
 
      res.status(200).json(user);
     }
     res.status(400).send("Invalid Credentials");
   } catch (err) {
     console.log(err);
   }
});

app.post("/welcome", auth, (req, res) => {
   res.status(200).send("Welcome");
});

app.use("*", (req, res) => {
   res.status(404).json({
     success: "false",
     message: "Page not found",
     error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
     },
   });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`);
})
