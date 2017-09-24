var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://postgres:684439@localhost:5432/db_users");

exports.get = function (cb) {
    db.any("SELECT * from users", 123)
        .then(function (data) {
            cb(data,null);
        })
        .catch(function (error) {
            cb(null,error);
        });

}

exports.getById = function (id,cb) {
    var userID = parseInt(id);
    db.one("SELECT * from users where id = $1", userID)
        .then(function (data) {
            cb(data,null);
        })
        .catch(function (error) {
           cb(null,error);
        });
}
exports.getByEmail = function (email,cb) {
    db.one("SELECT * from users where email = $1", email)
        .then(function (data) {
            cb(data,null);
        })
        .catch(function (error) {
           cb(null,error);
        });
}
exports.post = function (user,cb) {
    db.none('insert into users(firstname,lastname, role, domain, log_time, foto, email,password) ' +
        'values(${firstname}, ${lastname}, ${role}, ${domain}, ${log_time}, ${foto}, ${email}, ${password})',
        user).then(function (data) {
            cb(data,null);
        }).catch(function (error) {
            cb(null,error);
        });
}
exports.put = function (id,user,cb) {
    db.none('update users set firstname=$1, lastname = $2, role=$3, domain=$4, foto=$5, email=$6, password=$7 where id=$8',
        [user.firstname, user.lastname, user.role, user.domain, user.foto,
            user.email, user.password, parseInt(user.id)])
        .then(function (data) {
            cb(data,null);
        }).catch(function (error) {
            cb(null,error);
        });
}

exports.delete = function (id,cb) {
    db.result('delete from users where id = $1', id)
        .then(function (data) {
            cb(data,null);
        }).catch(function (error) {
        cb(null,error);
    });
}