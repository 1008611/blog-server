var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/aaa', function(req, res, next) {
  res.send('respond with a resource');
});
/* GET users listing. */
router.get('/aa', function(req, res, next) {
  res.send('respond 11111111111111111 a resource');
});

module.exports = router;
