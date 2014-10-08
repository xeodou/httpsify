var debug = require('debug')('redirectly:index');

var http = require('http'),
    koa = require('koa'),
    app = koa(),
    mount = require('koa-mount'),
    cors = require('koa-cors'),
    _request = require('request'),
    request = require('koa-request'),
    Router = require('koa-router'),
    UglifyJS = require('uglify-js');

app.use(cors());

app.use(function * (next) {
    this.body = 'Hello Heroku';
    yield next;
});

var url = function() {

    var url = new Router()
    url.get('/', function * (next) {
        var body = {}
        if (this.query && this.query.redirect) {
            var options = {
                url: this.query.redirect,
                headers: {
                    'User-Agent': 'request'
                }
            }
            if (this.query.minify) {
                var res = yield request(options);
                this.type = res.headers['content-type'];
                body = res.body;
                if (this.query.decodeuri) {
                    body = decodeURIComponent(body)
                    console.log(body)
                }
                if (this.query.replace && this.query.from && this.query.to) {
                    body = body.replace(new RegExp(this.query.from, 'g'), this.query.to);
                }
                body = UglifyJS.minify(body, {
                    fromString: true
                }).code;
            } else
                body = _request(options);
        }
        this.body = body
        yield next;
    })
    return url.middleware();
}

app.use(mount('/url', url()))

http.createServer(app.callback()).listen(process.env.PORT, function() {
    debug('listening port %s', process.env.PORT)
});
