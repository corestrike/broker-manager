/* Config OAuth2 Setting */
var INFOSCOOP_HOST='54.248.249.15';
var CLIENT_ID='2fe45841145fd9383bb807b374302d643ecd50ba165cbe08a75';
var CLIENT_SECRET='2fe45841145fd9383c5807b374302d643ecd50ba165cbe08a75';
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
                                redis.hset(userId,'brokerId','');

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
