module.exports = {
    get: get
};

var minimistOptions = {
    alias: {
        username: 'u',
        password: 'p'
    }
};

function get() {
    return require('minimist')(process.argv.slice(2), minimistOptions);
}
