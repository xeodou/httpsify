var debug = require('debug')('redirectly:index');

var http = require('http'),
    through2 = require('through2'),
    split = require('split'),
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
            this.body = request(options)
                .pipe(split())
                .pipe(through2(function(chunk, enc, cb) {
                    if(chunk)
                        this.push(self.query.decodeuri ? decodeURIComponent(chunk.toString()) : chunk);
                    cb();
                }))
                .pipe(through2(function(chunk, enc, cb) {
                    var str = chunk.toString();
                    if (str) {
                        if (self.query.replace && self.query.from && self.query.to) {
                            str = str.replace(new RegExp(self.query.from, 'g'), self.query.to);
                        }
                        this.push(str);
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
