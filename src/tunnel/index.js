var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('tunnel:client');

var Tunnel = require('./tunnel');

module.exports = function (port, opt, fn) {
    if (typeof opt === 'function') {
        fn = opt;
        opt = {};
    }

    opt = opt || {};
    opt.port = port;

    var client = Tunnel(opt);
    client.open(function(err) {
        if (err) {
            return fn(err);
        }

        fn(null, client);
    });
    return client;
};