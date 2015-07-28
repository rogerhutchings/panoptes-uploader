var argv = require('./argv').get();

var _config = {
    username: argv.username || process.env.PANOPTES_USERNAME || false,
    password: argv.password || process.env.PANOPTES_PASSWORD || false
};

if (!_config.username) {
    console.error('Error: Username not set, exiting.');
    process.exit(1);
}

if (!_config.password) {
    console.error('Error: Password not set, exiting.');
    process.exit(1);
}

module.exports = {
    get: get
};

function get() {
    return _config;
}
