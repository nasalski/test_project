var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://postgres:684439@localhost:5432/db_users");
var bcrypt = require('bcrypt');
const saltRounds = 10;



exports.get = function (cb) {
    db.any("SELECT * from users", 123)
        .then(function (data) {
            cb(data,null);
        })
        .catch(function (error) {
            cb(null,error);
        });

};

exports.getById = function (id,cb) {
    var userID = parseInt(id);
    db.one("SELECT * from users where id = $1", userID)
        .then(function (data) {
            cb(data,null);
        })
        .catch(function (error) {
           cb(null,error);
        });
};
exports.login = function (user,cb) {
       db.one("SELECT * from users where email = $1", user.email)
        .then(function (data) {
            console.log(data.password);
            // Load hash from your password DB.
            bcrypt.compare(user.password, data.password, function(err, res) {
                if(res == true){
                    cb(data,null);
                } else{
                    cb(null,"incorrect password");
                }
            });


        })
        .catch(function (error) {
            cb(null,error);
        });
};
exports.getByEmail = function (email,cb) {
    db.one("SELECT * from users where email = $1", email)
        .then(function (data) {
            cb(data, null);
        })
        .catch(function (error) {
            cb(null, error);
        });
};
exports.post = function (user,cb) {
    console.log(user.password);
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        user.password = hash;
        db.none('insert into users(firstname, lastname, nickname, role, domain, log_time, foto, avatar, email, password) ' +
            'values(${firstname}, ${lastname},${nickname}, ${role}, ${domain}, ${log_time}, ${foto}, ${avatar}, ${email}, ${password})',
            user).then(function (data) {
            cb(data,null);
        }).catch(function (error) {
            cb(null,error);
        });
    });


};
exports.put = function (id,user,cb) {
    /*bcrypt.hash(user.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.*/
        /*user.password = hash;*/
        db.none('update users set firstname=$1, lastname = $2, nickname = $3, role=$4, domain=$5, log_time=$6, foto=$7, avatar=$8, email=$9 where id=$10',
            [user.firstname, user.lastname, user.nickname, user.role, user.domain, user.log_time, user.foto,
                user.avatar, user.email, parseInt(user.id)])
            .then(function (data) {
                cb(data,null);
            }).catch(function (error) {
                cb(null,error);
            });
    /*});*/

};
exports.putPass = function (id,user,cb) {
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        user.password = hash;
        db.none('update users set password=$1 where id=$2',
            [ user.password, parseInt(user.id)])
            .then(function (data) {
                cb(data,null);
            }).catch(function (error) {
                cb(null,error);
            });
    });

};

exports.delete = function (id,cb) {
    db.result('delete from users where id = $1', id)
        .then(function (data) {
            cb(data,null);
        }).catch(function (error) {
        cb(null,error);
    });
};
/*----------------------------------*/
exports.postKey = function (key,cb) {
    console.log('and here', key);
    db.none('insert into keys(email,key, dat) ' +
    'values(${email}, ${key}, ${dat})', key)
        .then(function (data) {
            cb(data,null);
        }).catch(function (error) {
        cb(null,error);
    });
};
exports.getKey = function (key,cb) {
    /*var key = parseInt(key);*/
    console.log(key);
    db.one("SELECT * from keys where key = $1", key)
        .then(function (data) {
            cb(data,null);
        })
        .catch(function (error) {
            cb(null,error);
        });
};

exports.deleteKey = function (key,cb) {
    console.log(key);
    db.result('delete from keys where key = $1', key.toString())
        .then(function (data) {
            cb(data,null);
        }).catch(function (error) {
        cb(null,error);
    });
};