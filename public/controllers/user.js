
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
        getUsers(res);
    });
}

exports.put = function (req,res) {
    var userID = parseInt(req.params.id);
    Users.put(userID,req.body, function (docs,err) {
        if(err) {console.log(err);
            return res.sendStatus(500);
        }
        getUsers(res);
    });
}

exports.delete = function (req,res) {
    var userID = parseInt(req.params.id);
    Users.delete(userID,function (docs,err) {
        if(err) {console.log(err);
            return res.sendStatus(500);
        }
        getUsers(res);
    });

}