
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var userController = require('./public/controllers/user');
var app  = express();







app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true}));
/*app.use(express.static('/public'));*/
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


app.get('/usersjson', userController.get)
app.get('/usersjson/:id', userController.getById)
app.post('/usersjson', userController.post)
app.put('/usersjson/:id', userController.put)
app.delete('/usersjson/:id', userController.delete);
app.listen(3000, function(){
    console.log('API app started');
})


