var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('tunnel:client');
var net = require('net');

var HeaderHostTransformer = require('./header-host-transformer');

// 管理tunnels 分組
var TunnelCluster = function(opt) {
    if (!(this instanceof TunnelCluster)) {
        return new TunnelCluster(opt);
    }

    var self = this;
    self._opt = opt;

    EventEmitter.call(self);
};

TunnelCluster.prototype.__proto__ = EventEmitter.prototype;

// 建立新的通道
TunnelCluster.prototype.open = function() {
    var self = this;

    var opt = self._opt || {};

    var remote_host = opt.remote_host;
    var remote_port = opt.remote_port;

    var local_host = opt.local_host || 'localhost';
    var local_port = opt.local_port;

    debug('establishing tunnel %s:%s <> %s:%s', local_host, local_port, remote_host, remote_port);

    // 连接到 neixin tunnel server
    var remote = net.connect({
        host: remote_host,
        port: remote_port
    });

    remote.setKeepAlive(true);

    remote.on('error', function(err) {
        if (err.code === 'ECONNREFUSED') {
            self.emit('error', new Error('connection refused: ' + remote_host + ':' + remote_port + ' (check your firewall settings)'));
        }

        remote.end();
    });

    function conn_local() {
        if (remote.destroyed) {
            debug('remote destroyed');
            self.emit('dead');
            return;
        }

        debug('connecting locally to %s:%d', local_host, local_port);
        remote.pause();

        var local = net.connect({
            host: local_host,
            port: local_port
        });

        function remote_close() {
            debug('remote close');
            self.emit('dead');
            local.end();
        };

        remote.once('close', remote_close);

       local.once('error', function(err) {
            debug('local error %s', err.message);
            local.end();

            remote.removeListener('close', remote_close);

            if (err.code !== 'ECONNREFUSED') {
                return remote.end();
            }

            // 尝试重连
            setTimeout(conn_local, 1000);
        });

        local.once('connect', function() {
            debug('connected locally');
            remote.resume();

            var stream = remote;

            // if user requested specific local host
            // then we use host header transform to replace the host header
            if (opt.local_host) {
                debug('transform Host header to %s', opt.local_host);
                stream = remote.pipe(HeaderHostTransformer({ host: opt.local_host }));
            }

            stream.pipe(local).pipe(remote);

            // when local closes, also get a new remote
            local.once('close', function(had_error) {
                debug('local connection closed [%s]', had_error);
            });
        });
    }

    // tunnel is considered open when remote connects
    remote.once('connect', function() {
        self.emit('open', remote);
        conn_local();
    });
};

module.exports = TunnelCluster;