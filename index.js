var debug = require('debug')('redirectly:index');

var http = require('http'),
    koa = require('koa'),
    app = koa(),
    mount = require('koa-mount'),
    cors = require('koa-cors'),
    request = require('koa-request'),
    Router = require('koa-router');

app.use(cors());

app.use(function * (next) {
    this.body = 'Hello Heroku';
    yield next;
});

var url = function() {

    var url = new Router()
    url.get('/', function * (next) {

        if (this.query && this.query.redirect) {
            var options = {
                url: this.query.redirect,
                headers: {
                    'User-Agent': 'request'
                }
            }
            var res = yield request(options);
            this.body = res.body;
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
