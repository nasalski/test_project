
var express = require('express');
var config = require("nconf");
var path = require('path');
var bodyParser = require('body-parser');
var userController = require('./public/controllers/user');
var app  = express();
var flash = require('connect-flash');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var logger = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cookieSession = require('cookie-session');
var users = require('./public/models/user');
/*app.set('port', config.get("app:port") || 3000);*/
/*app.set('views', path.join(__dirname + "/..", 'views'));*/
app.set('views', __dirname + '/views/');
//app.use('views', express.static(__dirname + '/views'));


app.use('/static', express.static(__dirname + '/public'));

app.use('default',logger);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/views/auth.html'));
});
app.get('/users', function(req, res){
    res.sendFile(path.join(__dirname+'/views/users.html'));
});


/*------ passport------------*/
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email,password,done) {
        console.log("log");
        /*var docs = userController.getByEmail(user);
        console.log(docs);*/
        console.log(email);
        if (email == "www.slava.sn@gmail.com" && password == "123") {
            return done(null, {
                email: "www.slava.sn@gmail.com",
            });
        }

        return done(null, false, {
            message: 'Неверный логин или пароль'
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, JSON.stringify(user));
});


passport.deserializeUser(function (data, done) {
    try {
        done(null, JSON.parse(data));
    } catch (e) {
        done(err)
    }
});
app.get('/signup', function (req, res) {

        if (req.isAuthenticated()) {
            /*res.redirect('/users.html');*/
            res.sendFile(path.join(__dirname+'/views/users.html'));
            return;
        }

        /*res.render('auth', {
            error: req.flash('error')
        });*/
        res.sendfile('./views/auth.html');
    });

    app.get('/sign-out', function (req, res) {
        req.logout();
        res.redirect('/signup');
    });



    app.post('/signup', passport.authenticate('local', {
        successRedirect: '/users',
        failureRedirect: '/signup' })
    );



/*
app.post('/signup', function (req,res) {
    var user = {email:req.body.email,
        password: req.body.password};

    /!*var docs;
    userController.getByEmail(user,docs);
    if (docs != 'error')
        console.log(docs);*!/
        console.log(req.body.password);
    if (req.body.email == "www.slava.sn@gmail.com" && req.body.password == "123") {
        /!*res.sendFile(path.join(__dirname+'users.html'));*!/
        return res.status(200)
            .json({
                status: 'success',
                data: req.body.email,
                message: 'Retrieved one user'
            });
    }
    return res.sendStatus(500);
})
*/
/*----------------------------------------------------------------------*/



app.get('/usersjson', userController.get)
app.get('/usersjson/:id', userController.getById)
app.post('/usersjson', userController.post)
app.put('/usersjson/:id', userController.put)
app.delete('/usersjson/:id', userController.delete);
app.listen(3000, function(){
    console.log('API app started');
})


