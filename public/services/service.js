angular.module('usersService', [])

// super simple service
// each function returns a promise object
    .factory('UsersService', ['$http',function($http) {
        return {
            sendMail:function (email) {
                return $http.post('/sendmail',email);
            },
            /*login:function (user) {
                return $http.post('/signin',user);
            },*/
            logout:function () {
                return $http.get('/');
            },
            get : function() {
                return $http.get('/usersjson');
            },
            getById : function (id) {
                return $http.get('/usersjson/' + id);
            },
            getByEmail : function (email) {
                return $http.post('/usersjson/email', email);
            },
            create : function(Data) {
                return $http.post('/usersjson', Data);
            },
            update : function(id,Data) {
                return $http.put('/usersjson/' + id, Data);
            },
            deleteUser : function(id) {
                console.log("delete ID:", id);
                return $http.delete('/usersjson/' + id);
            },
            sendKey : function (key) {
                return $http.post('/sendkey', key);
            },
            getKey : function (key) {
                return $http.post('/new_password', key);
            },
            deleteKey : function (key) {
                return $http.delete('/deletekey/'+ key);
            },
            deletePhoto : function (photoUrl) {
                return $http.post('/deleteImg/', photoUrl);
            }

        }
    }]);
