const parser = require('./index');
const express = require('express');
const nodemon = require('nodemon');
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser');

const User = require("./model/user");
const auth = require("./middleware/auth");

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views')
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get("/", (req, res) => {
   res.render('home')
});

app.get('/parse', (req, res) => {
   res.render('parse')
   parser.startApp()
});


app.get('/getData', (req, res) => {
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

// Register
app.post("/register", async (req, res) => {

   // Our register logic starts here
   try {
     // Get user input
     const { first_name, last_name, email, password } = req.body;
 
     // Validate user input
     if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
     }
 
     // check if user already exist
     // Validate if user exist in our database
     const oldUser = await User.findOne({ email });
 
     if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
     }
 
     //Encrypt user password
     encryptedPassword = await bcrypt.hash(password, 10);
 
     // Create user in our database
     const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
     });
 
     // Create token
     const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
      expiresIn: "2h",
      }
     );
     // save user token
     user.token = token;
 
     // return new user
     res.status(201).json(user);
   } catch (err) {
     console.log(err);
   }
   // Our register logic ends here
});

// Login
app.post("/login", async (req, res) => {

   // Our login logic starts here
   try {
     // Get user input
     const { email, password } = req.body;
 
     // Validate user input
     if (!(email && password)) {
      res.status(400).send("All input is required");
     }
     // Validate if user exist in our database
     const user = await User.findOne({ email });
 
     if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
         { user_id: user._id, email },
         process.env.TOKEN_KEY,
         {
           expiresIn: "2h",
         }
      );
 
      // save user token
      user.token = token;
 
      // user
      res.status(200).json(user);
     }
     res.status(400).send("Invalid Credentials");
   } catch (err) {
     console.log(err);
   }
   // Our register logic ends here
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
