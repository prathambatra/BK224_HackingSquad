const fs = require('fs');

exports.get = function(key) {
    let config = fs.readFileSync('config.json').toString();
    config = JSON.parse(config);
    return config[key];
}

exports.set = function(key, value) {
    let config = fs.readFileSync('config.json').toString();
    config = JSON.parse(config);
    config[key] = value;

    try {
        fs.writeFileSync('config.json', JSON.stringify(config));
        console.log(`Wrote ${key}:${value} to config`);
    } catch (error) {
        console.log(error);
    }

    return;
}