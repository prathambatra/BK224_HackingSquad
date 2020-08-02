var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/apm', function(req, res, next) {
  res.render('apm');
});

router.get('/test', function(req, res, next) {
  res.render('test');
});

router.get('/train', function(req, res, next) {
  res.render('train');
});

module.exports = router;
