const express = require('express');
const Busboy = require('busboy')
const path = require('path');
const fs = require('fs');
const {exec} = require("child_process");
const configService = require('../services/config');
const moment = require('moment');

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
  if (fs.existsSync(path.join(__dirname, '..', 'public', 'uploads', 'test.txt'))) {
    datasetExists = true;
  }

  let modelOutput = configService.get('modelOutput');
  let lastTested = configService.get('lastTested');
  lastTested = moment(lastTested).fromNow();

  res.render('test', { datasetExists, modelOutput, lastTested });
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

  let accuracy = (+configService.get('accuracy')*100).toFixed(2);
  let lastTrained = configService.get('lastTrained');
  lastTrained = moment(lastTrained).fromNow();
  
  res.render('train', { datasetExists, accuracy, lastTrained });
});

// upload training data
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

router.post('/train/run',function(req, res, next) {
  let accuracy;
  exec('python3 mlscripts/train.py public/uploads/train.txt',
  (error, stdout, stderr) => {
    if (stdout) { 
      configService.set('accuracy', stdout);
      configService.set('lastTrained', moment().format());
    }
    // console.log(stderr);
    if (error !== null) {
        console.log(`exec error: ${error}`);
    }
  });
  
  res.redirect('/train');
})

router.post('/test/run',function(req,res,next) {
  var process = exec('python3 mlscripts/test.py public/uploads/test.txt',
        (error, stdout, stderr) => {
          if (stdout) { 
            configService.set('modelOutput', stdout);
            configService.set('lastTested', moment().format());
          }
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
  
  res.redirect('/test');
})

module.exports = router;
