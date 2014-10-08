var debug = require('debug')('redirectly:index');

var http = require('http'),
    through2 = require('through2'),
    koa = require('koa'),
    app = koa(),
    mount = require('koa-mount'),
    cors = require('koa-cors'),
    request = require('request'),
    Router = require('koa-router');

app.use(cors());

app.use(function * (next) {
    this.body = 'Hello Heroku';
    yield next;
});

var url = function() {

    var url = new Router()
    url.get('/', function * (next) {
        var self = this;
        if (this.query && this.query.redirect) {
            var options = {
                url: this.query.redirect,
                headers: {
                    'User-Agent': 'request'
                }
            }
            if (this.query.type)
                this.set('Content-Type', this.query.type);
            this.body = request(options)
                .pipe(through2(function(chunk, enc, cb) {
                    if (chunk) {
                        if (self.query.decodeuri) {
                            var str = chunk.toString();
                            try {
                                this.push(decodeURIComponent(str));
                            } catch (err) {
                                this.push(chunk);
                            }
                        } else
                            this.push(chunk);
                    }
                    cb();
                }))
                .pipe(through2(function(chunk, enc, cb) {
                    if (self.query.replace && self.query.from && self.query.to) {
                        var str = chunk.toString();
                        str = str.replace(new RegExp(self.query.from, 'g'), self.query.to);
                        this.push(str);
                    } else {
                        this.push(chunk)
                    }
                    cb();
                }));
        } else
            this.body = {}
        yield next;

    })
    return url.middleware();
}

app.use(mount('/url', url()))

http.createServer(app.callback()).listen(process.env.PORT, function() {
    debug('listening port %s', process.env.PORT)
});
