const express = require('express');
const router  = express.Router();
const { checkLogin } = require("../middlewares")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', checkLogin, (req, res, next) => {
  res.render('profile', { user: req.user });
});

module.exports = router;
