angular.module('allControllers')
.service('Storage', function () {
    var _name = null;
    var _user = null;
    return {
        setName: function (name) {
            _name = name;
        },
        getName: function () {
            return _name;
        },
        setUser: function (user) {
            _user = user;
        },
        getUser: function () {
            return _user;
        }
    }
});