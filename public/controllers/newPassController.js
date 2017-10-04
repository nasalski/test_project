angular.module('allControllers')
.controller('NewPassCtrl',['$location', '$scope', '$http', '$rootScope','UsersService',
    function($location, $scope, $http, $rootScope,UsersService) {
        var user = {};
        console.log("new pass controller");
        function parseUrl() {
            var data = {};
            if (location.search) {
                var pair = (location.search.substr(1)).split('&');
                for (var i = 0; i < pair.length; i++) {
                    var param = pair[i].split('=');
                    data[param[0]] = param[1];
                }
            }
            return data;
        }
        var key = parseUrl();
        console.log(key.key);
        var str = {
            key:key.key.toString()
        };
        UsersService.getKey(str)
            .success(function (data) {
                /*console.log(data.data);*/
                //изменяем пароль пользователю
                var email = {
                    email:data.data.email
                };
                UsersService.getByEmail(email)
                    .success(function (data) {
                        /*console.log(data.data);*/
                        user = data.data;
                    });
            })
            .error(function () {
                $location.url("/notfound");
            });

        $scope.confirm = function () {
            if ($scope.formData.password == $scope.formData.confirmPass && $scope.formData.password != ''){
                user.password = $scope.formData.password;
                console.log(user);
                UsersService.update(user.id, user)

                // if successful creation, update users array
                    .success(function () {
                        console.log('pass updated');
                        console.log(str);
                        UsersService.deleteKey(key.key)
                            .success(function () {
                                window.alert('The password was reset!');
                                $location.url('/signin');
                            })

                    });

            }
        }
    }]);