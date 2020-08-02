const express = require('express');
const Busboy = require('busboy')
const path = require('path');
const fs = require('fs');

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

router.post('/train', function(req, res, next) {
  let busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    let filePath = path.join(__dirname, 'uploads', filename);
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on('finish', function() {
    res.writeHead(200, { 'Connection': 'close' });
    res.end("That's all folks!");
  })
})

module.exports = router;
