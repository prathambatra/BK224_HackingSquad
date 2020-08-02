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
  let datasetExists = false;

  if(fs.existsSync(path.join(__dirname, '..', 'public', 'uploads', 'test.txt'))) {
    datasetExists = true;
  }
  res.render('test', { datasetExists });
});

router.post('/test/upload', function(req, res, next) {
  let busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    let filePath = path.join(__dirname, '..', 'public', 'uploads', 'test.txt');
    
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on('finish', function() {
    res.redirect('/test');
  });

  return req.pipe(busboy);
})

router.get('/train', function(req, res, next) {
  let datasetExists = false;

  if(fs.existsSync(path.join(__dirname, '..', 'public', 'uploads', 'train.txt'))) {
    datasetExists = true;
  }
  res.render('train', { datasetExists });
});

router.post('/train/upload', function(req, res, next) {
  let busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    let filePath = path.join(__dirname, '..', 'public', 'uploads', 'train.txt');
    
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on('finish', function() {
    res.redirect('/train');
  });

  return req.pipe(busboy);
})

module.exports = router;
