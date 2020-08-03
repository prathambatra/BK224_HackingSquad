const express = require('express');
const Busboy = require('busboy')
const path = require('path');
const fs = require('fs');
const {exec} = require("child_process");
const configService = require('../services/config');
const moment = require('moment');
const neatCsv = require('neat-csv');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('gail');
});

router.get('/index', function(req, res, next) {
  res.render('index');
});

router.get('/apm', function(req, res, next) {
  res.render('apm');
});

router.get('/dashboard', async function(req, res, next) {
  let flow_rate = [],
      pressure_ci = [],
      pressure_hi = [],
      coldfluid_pd = [],
      hotfluid_pd = [],
      ci_temp = [],
      co_temp = [],
      hi_temp = [],
      ho_temp = [],
      density = [],
      ht_coeff = configService.get('modelOutput');

  let csv;
  fs.readFile(path.join(__dirname, '..', 'public', 'uploads', 'test.txt'), async (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    csv = await neatCsv(data);
    csv.forEach(function(object) {
      flow_rate.push(+object['flow_rate(l/min)']);
      pressure_ci.push(+object['Pressure_ci']);
      pressure_hi.push(+object['Pressure_hi']);
      coldfluid_pd.push(+object['coldfluid_Pd']);
      hotfluid_pd.push(+object['hotfluid_Pd']);
      ci_temp.push(+object['Ci_temp']);
      co_temp.push(+object['co_temp']);
      hi_temp.push(+object['hi_temp']);
      ho_temp.push(+object['ho_temp']);
      density.push(+object['Density']);
      // ht_coeff.push(+object['HT_Coefficient']);
    });
  });


  res.render('dashboard', {
    flow_rate,
    pressure_ci,
    pressure_hi,
    coldfluid_pd,
    hotfluid_pd,
    ci_temp,
    co_temp,
    hi_temp,
    ho_temp,
    density,
    ht_coeff
  });
});

router.get('/test', function(req, res, next) {
  let datasetExists = false;
  let alertDays = [];

  if (fs.existsSync(path.join(__dirname, '..', 'public', 'uploads', 'test.txt'))) {
    datasetExists = true;
  }

  let modelOutput = JSON.parse(configService.get('modelOutput'));
  let day = 1;
  modelOutput.forEach(function(value) {
    if(value < 0.9) {
      alertDays.push(day);
    }
    day += 1;
  })
  let lastTested = configService.get('lastTested');
  lastTested = moment(lastTested).fromNow();

  res.render('test', { datasetExists, modelOutput, lastTested, alertDays });
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
