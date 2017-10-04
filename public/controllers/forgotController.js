angular.module('allControllers')
    .controller('ForgCtrl',['$location', '$scope', '$http', '$rootScope','UsersService', function($location, $scope, $http, $rootScope,UsersService) {
        console.log("forgot pass controller");
        $scope.top = false;
        function clearForm() {
            $scope.formData = {
                email: null,
            };
        }
        clearForm();
        $scope.sendPassword = function() {

            console.log('i want send password');
            $scope.email = {
                email:$scope.formData.email
            };
            if ($scope.email != "") {
                console.log($scope.formData.email + " проверим почту");
                UsersService.getByEmail($scope.email)
                    .success(function () {
                        console.log('send mail');
                        //создадим некий ключ, который отправим по почте и его же добавим в новую таблицу
                        //которая  будет хранить почты на которые отправлены письма и ключи
                        var key = new Date().getTime();
                        $scope.email = {
                            email:$scope.formData.email,
                            key: key
                        };

                        //здесь мы отправим письмо на указанную почту
                        UsersService.sendMail($scope.email)
                            .success(function(){
                                console.log('success sending mail');
                                //после успешной отправки письма отправим в нашу базу ключ
                                var date = new Date();
                                key = key.toString();
                                $scope.email = {
                                    email:$scope.formData.email,
                                    key: key,
                                    dat: date
                                };
                                UsersService.sendKey($scope.email)
                                    .success(function () {
                                        console.log('success sending key to base');
                                        $scope.top = true;
                                    });
                            });
                        /*clearForm();*/
                    })
                    .error(function () {
                        window.alert('такой почты нет');
                        /*clearForm();*/
                    });
                // call the create function from our service (returns a promise object)

            } else {
                window.alert('empty inputs');
            }



        }
    }]);