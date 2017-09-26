angular.module('service', [])

// super simple service
// each function returns a promise object
    .factory('Users', ['$http',function($http) {
        return {
            get : function() {
                return $http.get('/usersjson');
            },
            getById : function (id) {
                return $http.get('/usersjson/' + id);
            },
            getByEmail : function (email,password) {
                return $http.get('/usersjson/' + id);
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
            }
        }
    }]);
