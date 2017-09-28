
var Users = require('../models/user');
function getUsers(res) {
    Users.get(function (docs,err) {
        if(err) {console.log(err);
            return res.sendStatus(500);
        }
        res.status(200)
            .json({
                status: 'success',
                data: docs,
                message: 'Retrieved all users'
            });
    });
}
exports.get = function (req, res) {
    getUsers(res);
};

exports.login = function (user,cb) {
    Users.login(user, function (docs,err) {
            if(err) {console.log(err);
                return cb(null, err);
            }

            return cb(docs,null);
        });
};

exports.getByEmail = function (req,res) {
    console.log(req.body.email);
    Users.getByEmail(req.body.email, function (docs,err) {
            if(err) {console.log(err);
                return res.sendStatus(500);
            }
            res.status(200)
                .json({
                    status: 'success',
                    data: docs,
                    message: 'Retrieved one user'
                });
        })
    };
exports.getById = function (req,res) {
    Users.getById(req.params.id, function (docs,err) {
            if(err) {console.log(err);
                return res.sendStatus(500);
            }
            res.status(200)
                .json({
                    status: 'success',
                    data: docs,
                    message: 'Retrieved one user'
                });
        }
    )};

exports.post = function (req,res) {
    Users.post(req.body,function (docs,err) {
        if(err) {console.log(err);
            return res.sendStatus(500);
        }
        res.status(200)
            .json({
                status: 'success',
            });
        /*getUsers(res);*/
    });
}

exports.put = function (req,res) {
    var userID = parseInt(req.params.id);
    Users.put(userID,req.body, function (docs,err) {
        if(err) {console.log(err);
            return res.sendStatus(500);
        }
        /*getUsers(res);*/
        res.status(200)
            .json({
                status: 'success',
            });
    });
}

exports.delete = function (req,res) {
    var userID = parseInt(req.params.id);
    Users.delete(userID,function (docs,err) {
        if(err) {console.log(err);
            return res.sendStatus(500);
        }
        /*getUsers(res);*/
        res.status(200)
            .json({
                status: 'success',
            });
    });

}