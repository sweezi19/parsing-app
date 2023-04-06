const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.get('/signup', UserController.signup_page)

router.post('/signup', UserController.user_signup);

router.get('/login', UserController.login_page);

router.post("/login", UserController.user_login);

router.delete("/:userId", checkAuth, UserController.user_delete);


module.exports = router;

