angular.module('allControllers')
    .controller('SignUpCtrl',['$location', '$scope', '$http', '$rootScope','UsersService', function($location, $scope, $http, $rootScope,UsersService) {
        console.log("register controller");

        $scope.clearForm = function() {
            $scope.formData = {
                id: null,
                firstname:null,
                lastname:null,
                role:null,
                domain:null,
                log_time:null,
                foto:null,
                email:null,
                password:null

            };
        };

        $scope.clearForm();

        console.log('works');
        $scope.register = function() {
            $scope.email = {
                email:$scope.formData.email
            };
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            console.log('i want create new person');
            if ($scope.formData.lastname != "" && $scope.formData.firstname != "" && $scope.formData.email != ""
            ) { if ( $scope.formData.password == $scope.password){
                console.log($scope.formData.email + " проверим почту");
                UsersService.getByEmail($scope.email)
                    .success(function (data) {
                        console.log();
                        window.alert('такая почта уже есть');

                    })
                    .error(function () {
                        UsersService.create($scope.formData)
                        // if successful creation, call our get function to get all the new users
                            .success(function () {
                                console.log('created  person' + $scope.formData.firstname);
                                window.alert('success register');
                                $location.url("/signin");
                                $scope.clearForm(); // clear the form so our user is ready to enter another
                            });
                    })
                // call the create function from our service (returns a promise object)

            } else{
                window.alert('incorrect repeated password');
            }

            } else {
                window.alert('empty inputs');
            }



            /*$http.post('/signin', user)
                .success(function (data, docs) {
                    if (docs == 200) {
                        console.log("success register");
                        $rootScope.currentUser = user;
                        $rootScope.isAuth = true;
                        $location.url("/users");

                    } else window.alert('something wrong');
                });*/

        }




    }]);