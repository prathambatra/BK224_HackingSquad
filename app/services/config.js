const fs = require('fs');
let config;

exports.get = function(key) {
    config = require('../config.json');
    return config[key];
}

exports.set = function(key, value) {
    config = require('../config.json');
    config[key] = +value;
    fs.writeFile('config.json', JSON.stringify(config), (err) => {
        if (err) { throw err; }
        console.log(`Wrote ${JSON.stringify(config)} to file`);
    })
}