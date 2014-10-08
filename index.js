var debug = require('debug')('redirectly:index');

var http = require('http'),
    koa = require('koa'),
    app = koa();

app.use(function *(next) {
    this.body = 'Hello Heroku';
    yield next;
});

http.createServer(app.callback()).listen(process.env.PORT, function() {
    debug('listening port %s', process.env.PORT)
});
