/**
 * Created by jbarros on 13/02/2015.
 */

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// database connection
mongoose.connect('mongodb://localhost:27017/gdl-editor-test');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
// shows all request logs on the console.
app.use(logger('dev'));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// static file location. Set the static files location /app/img will be /img for users
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// define model
var Guide = mongoose.model('Guide', {
    name : String,
    gdl : String
});


// routes ======================================================================

// api ---------------------------------------------------------------------
// get all guides
app.get('/api/guides', function(req, res) {

    // use mongoose to get all guides in the database
    Guide.find(function(err, guides) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(guides); // return all guides in JSON format
    });
});

// create guide and send back all guides after creation
app.post('/api/guides', function(req, res) {

    // create a guide, information comes from AJAX request from Angular
    Guide.create({
        name : req.body.name,
        done : false
    }, function(err, guide) {
        if (err)
            res.send(err);

        // get and return all the guides after you create another
        Guide.find(function(err, guides) {
            if (err)
                res.send(err)
            res.json(guides);
        });
    });
});

// delete a guide
app.delete('/api/guides/:guide', function(req, res) {
    Guide.remove({
        _id : req.params.guide
    }, function(err, guide) {
        if (err)
            res.send(err);

        // get and return all the guides after you create another
        Guide.find(function(err, guides) {
            if (err)
                res.send(err)
            res.json(guides);
        });
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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

// Load the single HTML view file where our Single App Page goes
// Angular will handle the page changes on the front-end
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
})

// Listens on port 8080 and runs the server
app.listen(8081, function() {
    console.log('App listening on port 8081');
})

module.exports = app;


