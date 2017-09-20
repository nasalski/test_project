angular.module('service', [])

// super simple service
// each function returns a promise object
    .factory('Users', ['$http',function($http) {
        return {
            get : function() {
                return $http.get('/usersjson');
            },
            create : function(Data) {
                return $http.post('/usersjson', Data);
            },
            deleteUser : function(id) {
                console.log("delete ID:", id);
                return $http.delete('/usersjson/' + id);
            }
        }
    }]);
