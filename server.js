
var express = require('express');
var config = require("nconf");
var path = require('path');
var bodyParser = require('body-parser');
var userController = require('./public/controllers/user');
var mailer = require('./public/controllers/nodeMailer');
var app  = express();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var logger = require('morgan');



app.set('views', __dirname + '/views/');
app.use('/static', express.static(__dirname + '/views'));
app.use('/static', express.static(__dirname + '/public'));

app.use('default',logger);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
    console.log('path /');
    res.redirect('/signin');
});
app.get('/signup', function(req, res){
    console.log('path signup');
    res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/users', function(req, res){
    console.log('path users');
    /*res.redirect('/signin');*/
    res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/signin', function(req, res){
    console.log('path signin');
    res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/logout', function(req, res){
    res.send('/logout');
});


/*------ passport------------*/
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email,password,done) {
        var user = {
            email: email,
            password: password
        };

        userController.login(user, function (docs, err) {
            if (err) {
                console.log(err);
            }
            if (email == docs.email && password == docs.password) {
                return done(null, {
                    email: email

                });
            } else {
                return done(null, false, {
                    message: 'Неверный логин или пароль'

                });
            }
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

/*app.get('/sign-out', function (req, res) {
    req.logout();
    res.redirect('/');
});

*/
app.post('/signin', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/signin' })
);

/*app.post('/signup', passport.authenticate('local'), function(req, res) {
    console.log("works");
    res.sendFile(path.join(__dirname+'/views/users.html'));
});*/

/*----------------------------------------------------------------------*/



app.get('/usersjson', userController.get)
app.get('/usersjson/:id', userController.getById)
app.post('/usersjson/email', userController.getByEmail)
app.post('/usersjson', userController.post)
app.put('/usersjson/:id', userController.put)
app.delete('/usersjson/:id', userController.delete);

app.post('/sendkey', userController.postKey);
app.post('/new_password',userController.getKey);
app.get('/new_pass',function (req,res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});
app.delete('/deletekey/:key', userController.deleteKey);

app.post('/sendmail',function(req,res){     //subscription, signal) {
                        console.log("send mail");
                       opts = {
                          from: "Thunderbolt",//'Simple Notification Service',
                          to: req.body.email
                          //subject: 'test',//subscription.eventTitle + ' happened at: ' + new Date(),
                          //body: 'test'//signal.instancedata
                       };
                       // Отправка уведомления
                       console.log(req.body);
                       mailer.sendMail(opts,res,req.body.key,req.body.email);
                    });

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});
app.listen(3000, function(){
    console.log('API app started');
})


