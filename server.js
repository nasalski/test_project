
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
/*var router = express.Router();*/
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://postgres:@localhost:5432/db_users");

/*var db = require('./queries.js');*/
var app  = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true}));
/*app.use(express.static('public'));*/
app.use('/static', express.static(__dirname + '/public'));
/*app.use(express.static(path.join(__dirname, 'public')));*/
app.get('/', function(req, res){
    res.sendfile('index.html');
});
app.get('/users', function(req, res){
    res.sendfile('users.html');
});
process.on("unhandledRejection", (reason) => {
    console.log(reason)
})
function getUsers(res) {
    db.any("SELECT * from users", 123)
        .then(function (data) {
            console.log("DATA:", data);
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved all users'
                });
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            res.sendStatus(500);
        });
}

app.get('/usersjson', function (req,res) {
    getUsers(res);
});
app.get('/usersjson/:id', function (req,res) {
    var userID = parseInt(req.params.id);
    db.one("SELECT * from users where id = $1", userID)
        .then(function (data) {
            console.log("DATA:", data);
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved all users'
                });
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            res.sendStatus(500);
        });
})

app.post('/usersjson', function (req,res) {
    /*var userID = parseInt(req.params.id);*/
    var user = {
        name: req.body.name,
        role: req.body.role,
        age : req.body.age,
        foto: req.body.foto,
    };
    console.log("post:", req);
    user.age = parseInt(user.age);
    db.none('insert into users(name, role, age, foto) ' +
        'values(${name}, ${role}, ${age}, ${foto})',
        user).then(function (data) {
            /*console.log("DATA:", data);*/
            /*res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted one user'
                });*/
            getUsers(res);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            res.sendStatus(500);
        });
})

app.put('/usersjson/:id', function (req,res) {
    var userID = parseInt(req.params.id);
    var user = {
        id  : userID,
        name: req.body.name,
        role: req.body.role,
        age : req.body.age,
        foto: req.body.foto,
    };
    db.none('update users set name=$1, role=$2, age=$3, foto=$4 where id=$5',
        [user.name, user.role, parseInt(user.age),
            user.foto, parseInt(user.id)])
        .then(function () {
            console.log("DATA:", data);

            /*res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated user'
                });*/
            getUsers(res);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            res.sendStatus(500);
        });
})

app.delete('/usersjson/:id', function (req,res) {
    var userID = parseInt(req.params.id);
    /*var userID = req.params.id*/

    db.result('delete from users where id = $1', userID)
        .then(function (result) {
            /*res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} user`
                });*/
            getUsers(res);
        }).catch(function (err) {
            return console.log("err", err);
        });

});
app.listen(3000, function(){
    console.log('API app started');
})


