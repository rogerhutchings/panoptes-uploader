var Panoptes = require('panoptes-client');
var xhrc = require('xmlhttprequest-cookie');

global.XMLHttpRequest = xhrc.XMLHttpRequest;

var config = require('./config').get();

var _client = new Panoptes({
    appID: 'f79cf5ea821bb161d8cbb52d061ab9a2321d7cb169007003af66b43f7b79ce2a',
    host: 'https://panoptes.zooniverse.org',
});

var api = _client.api;
var auth = _client.api.auth;

module.exports = {
    api: api,
    auth: auth,
    signIn: signIn,
    signOut: signOut
};

function signIn() {
    return auth.signIn({
        login: config.username,
        password: config.password
    });
}

function signOut() {
    return auth.signOut();
}
