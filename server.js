var express = require('express');
/*var bodyParser = require('body-parser');*/
/*var db = require(./db);*/
var pg = require('pg');
var conString = "postgres://listapps@localhost/listapps";

function query(sql, params, callback) {
    pg.connect(conString, function(err, client, done) {

        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(sql, params, function(err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
            }
            if (callback) {
                callback(result);
            }
        });

    });
};

function create(item, callback) {
    query('insert into list (text) values ($1)', [item.text], callback);
}

function read(callback) {
    query('select * from list', [], function (err, result) {
        callback(err, result);
    });
}

function readById(id, callback) {
    query('select * from list where id = $1', id, callback);
}

function update(id, text, callback) {
    query('update list set text = $1 where id = $2', [text, id], callback);
}

function del(id, callback) {
    query('delete from list where id = $1', id, callback);
}


    app.get('/items', function (req, res) {
        read(function (err, result) {
            res.render('list', {list: result.rows});
        });
    });

app.get('/items/add', function (req, res) {
    res.render('form', {item: {text: ''}});
});

app.post('/items/add', function (req, res) {
    create({text: req.body.text},
        function () {
            res.redirect('/items');
        });
});

app.get('/items/delete/:id', function (req, res) {
    del(req.params.id, function () {
        res.redirect('/items');
    });
});

app.get('/items/edit/:id', function (req, res) {
    readById(req.params.id, function (err, result) {
        res.render('form', {item: result.rows[0]});
    });
});

app.post('/items/edit/:id', function (req, res) {
    update(req.params.id, req.body.text, function () {
        res.redirect('/items');
    });
});

var app = express();
app.listen(3012, function () {
    console.log('app started');
})