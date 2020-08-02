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
    let filePath = path.join(__dirname, '..', 'public', 'uploads', filename);
    
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on('finish', function() {
    res.send('done uploading');
  });

  return req.pipe(busboy);
})

module.exports = router;
