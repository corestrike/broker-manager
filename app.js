/* Config OAuth2 Setting */
var INFOSCOOP_HOST='<Host>';
var CLIENT_ID='<ClientID>';
var CLIENT_SECRET='<ClientSecret>';
var FLG=false;

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var users = require('./routes/users');
var redis = require('redis').createClient();
var OAuth2 = require('simple-oauth2')({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    site: 'http://'+INFOSCOOP_HOST+'/infoscoop'
});

/* init for redis */
redis.on('ready', function(err){
    console.log('redis ready');
    if(!FLG){
        console.log('init redis.')
        redis.flushdb();

        // redis.hset('hoge','userId','hoge');
        // redis.hset('hoge','videoBrokerId','1');
        // redis.hset('hoge','documentBrokerId','2');
        // redis.hset('hoge','presentationBrokerId','3');
        // FLG=true;
        OAuth2.Client.getToken({},function(err, result){
            if (err) console.log('Access Token Error', err.message);

            var opt = {
                host: INFOSCOOP_HOST,
                path: '/infoscoop/isapi/v1/admin/profiles/user.json?access_token='+result.access_token,
            }

            var req = http.get(opt, function(res){
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            var json = JSON.parse(chunk);
                            for(var i in json.userProfiles) {
                                var userId = json.userProfiles[i].uid;
                                redis.hset(userId,'userId',userId);
                                redis.hset(userId,'videoBrokerId','');
                                redis.hset(userId,'documentBrokerId','');
                                redis.hset(userId,'presentationBrokerId','');
                                console.log('Regist user : '+userId);
                            }
                            FLG=true;
                        });
                    });
        });
    }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('redis', redis);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
}).options('*', function(req, res, next){
    res.end();
});
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// app.mounted(function(parent){
//     console.log('start');
// });

module.exports = app;
