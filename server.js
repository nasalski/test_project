
var express = require('express');
var config = require("nconf");
var path = require('path');
var bodyParser = require('body-parser');
var userController = require('./controllers/user');
var mailer = require('./lib/nodeMailer');
var app  = express();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var logger = require('morgan');
var multiparty = require('multiparty');
var fs = require('fs');


app.set('views', __dirname + '/views/');
app.use('/static', express.static(__dirname + '/views'));
app.use('/static', express.static(__dirname + '/public'));

app.use('default',logger);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true}));

app.use(passport.initialize());
app.use(passport.session());
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
            console.log(docs);
            console.log(email);
            console.log(password);
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

/*function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //if user is looged in, req.isAuthenticated() will return true
        next();
    } else{
        res.redirect("/signin");
    }
}*/

/*app.get('/users', function(req,res){
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname + '/index.html'));
    } else res.redirect('/signin');
});*/


/*app.get('/users', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/signin'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            res.sendFile(path.join(__dirname+'/index.html'));
        });
    })(req, res, next);
});*/
/*app.get('/signin', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { res.sendFile(path.join(__dirname+'/index.html')); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/users');
        });
    })(req, res, next);
});*/

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/signin');
});

app.post('/signin', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/signin' })
);

/*----------------------------------------------------------------------*/

app.post('/deleteImg', function (req,res) {
    var filePath = './public/img/' + req.body.photoUrl;
    console.log(filePath);
    fs.unlinkSync(filePath);
});
//for upload files
app.post('/upload', function(req, res, next) {
    // создаем форму
    var form = new multiparty.Form();
    //здесь будет храниться путь с загружаемому файлу, его тип и размер
    var uploadFile = {uploadPath: '', type: '', size: 0};
    //максимальный размер файла
    var maxSize = 2 * 1024 * 1024; //2MB
    //поддерживаемые типы(в данном случае это картинки формата jpeg,jpg и png)
    var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    //массив с ошибками произошедшими в ходе загрузки файла
    var errors = [];

    //если произошла ошибка
    form.on('error', function(err){
        if(fs.existsSync(uploadFile.path)) {
            //если загружаемый файл существует удаляем его
            fs.unlinkSync(uploadFile.path);
            console.log('error');
        }
    });

    form.on('close', function() {
        //если нет ошибок и все хорошо
        if(errors.length == 0) {
            //сообщаем что все хорошо
            res.send({status: 'ok', text: 'Success'});
        }
        else {
            if(fs.existsSync(uploadFile.path)) {
                //если загружаемый файл существует удаляем его
                fs.unlinkSync(uploadFile.path);
            }
            //сообщаем что все плохо и какие произошли ошибки
            res.send({status: 'bad', errors: errors});
        }
    });

    // при поступление файла
    form.on('part', function(part) {
        //читаем его размер в байтах
        uploadFile.size = part.byteCount;
        //читаем его тип
        uploadFile.type = part.headers['content-type'];
        //путь для сохранения файла
        uploadFile.path = './public/img/' + part.filename;

        //проверяем размер файла, он не должен быть больше максимального размера
        if(uploadFile.size > maxSize) {
            errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
        }

        //проверяем является ли тип поддерживаемым
        if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
            errors.push('Unsupported mimetype ' + uploadFile.type);
        }

        //если нет ошибок то создаем поток для записи файла
        if(errors.length == 0) {
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
        }
        else {
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
    });

    // парсим форму
    form.parse(req);
});


/*----------------------------------------------------------------------*/

app.get('/usersjson', userController.get);
app.get('/usersjson/:id', userController.getById);
app.post('/usersjson/email', userController.getByEmail);
app.post('/usersjson', userController.post);
app.put('/usersjson/:id', userController.put);
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


