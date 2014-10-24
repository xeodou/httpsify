var debug = require('debug')('redirectly:index');

var http = require('http'),
    koa = require('koa'),
    app = koa(),
    mount = require('koa-mount'),
    cors = require('koa-cors'),
    serve = require('koa-static'),
    request = require('koa-request'),
    Router = require('koa-router'),
    minify = require('minify');


app.use(cors());

app.use(serve('client'));

var url = function() {

    var url = new Router()
    url.get(/\/*/i, function * (next) {
        var body = {}
        if (this.query && this.query.redirect) {
            var expression = /[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi;
            var url = this.query.redirect
            if (expression.test(this.query.redirect)) {
                if (!/(https|http:\/\/)/.test(url))
                    url = 'http://' + url;
                var options = {
                    url: url,
                    // Return as buffer.
                    encoding: null,
                    headers: {
                        'User-Agent': 'request'
                    }
                }
                var res = yield request(options);
                this.type = res.headers['content-type'];
                if (/javascript|css/g.test(this.type)) {
                    var encode = res.headers['content-encoding'] || 'utf-8';
                    body = new Buffer(res.body, 'binary').toString(encode);

                    if (this.query.decodeuri) {
                        body = decodeURIComponent(body)
                    }
                    if (this.query.replace && this.query.from && this.query.to) {
                        body = body.replace(new RegExp(this.query.from, 'g'), this.query.to);
                    }
                    if (this.query.minify) {
                        body = minify(body);
                    }
                } else if (/image/g.test(this.type) && this.query.base64) {
                    body = new Buffer(res.body, 'binary').toString('base64');
                    body = 'data:' + this.type + ';base64,' + body;
                } else {
                    body = res.body
                }
            }
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
