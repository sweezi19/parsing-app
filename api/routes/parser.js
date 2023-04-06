const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const parserController = require("../controllers/parser");

router.get('/start', checkAuth, parserController.startParse);

// router.get('/stop', checkAuth, parserController.startParse);

router.get('/', checkAuth, (req, res) => {
    // parser.startApp()
    res.status(200).render('parser')
});

module.exports = router;