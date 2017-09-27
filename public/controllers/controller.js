
angular.module('allControllers', [])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true);

    })
    .controller('AuthCtrl',['$location', '$scope', '$http', '$rootScope', function($location, $scope, $http, $rootScope) {
        /*console.log("yep");*/
        $scope.login = function(user) {
            /*console.log(user.email);*/
            $http.post('/signup', user)
                .success(function(data,docs) {
                    if(docs==200){
                        console.log("im here");
                        $rootScope.currentUser = user;
                        $rootScope.isAuth = true;
                        $location.url("/users");
                        /*$scope.apply()*/
                        /*location.reload(true);*/

                    } else alert("не верный логин или пароль");
                });
        }


    }])
// inject the service factory into our controller
    .controller('usersController', ['$scope','$http','$rootScope','UsersService', function($scope, $http,$rootScope, UsersService) {
        $scope.formData = {
            firstname:"",
            lastname:"",
            role:"",
            domain:"",
            log_time:"",
            foto:"",
            email:"",
            password:"",
        };
        $scope.id = 0;
        $scope.propertyName = 'lastname';
        $scope.reverse = true;
        $scope.loading = true;
        $scope.email={
            email:$rootScope.currentUser.email
        };
        UsersService.getByEmail($scope.email)
            .success(function (data) {
                $scope.currentUser = data.data;
            })
        // SORTING table by lastname and firstname ========================
        $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };
        // GET =====================================================================
        // when landing on the page, get all users and show them
        // use the service to get all the users
        UsersService.get()
            .success(function(data) {
                $scope.users = data.data;
                $scope.loading = false;
            });

        // GET one by id =====================================================================
        // when landing on the page, get one user and show
        // use the service to get one user by id
        $scope.getById = function(id)
            {$scope.loading = true;
                UsersService.getById(id)
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.formData = data.data
                        $scope.id = id;
                    });
            }
        // CREATE ==================================================================
        // when submitting the add form, send the data user to the node API
        $scope.create = function() {

            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            console.log('i want create new person');
            if ($scope.formData.lastname != "" && $scope.formData.firstname != "") {
                $scope.loading = true;
                console.log('need to create person' + $scope.formData.firstname);
                // call the create function from our service (returns a promise object)
                UsersService.create($scope.formData)

                // if successful creation, call our get function to get all the new users
                    .success(function(data) {
                        console.log('returned' + data.data);
                        $scope.loading = false;
                        $scope.formData = {
                            firstname:"",
                            lastname:"",
                            role:"",
                            domain:"",
                            log_time:"",
                            foto:"",
                            email:"",
                            password:"",
                        }; // clear the form so our user is ready to enter another
                        $scope.users = data.data; // assign our new list of user
                    });
            }
        };
        // UPDATE ==================================================================
        // when submitting the updating form, send the data user to the node API
        $scope.update = function() {

            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if ($scope.formData.lastname != "" && $scope.formData.firstname != "") {
                if($scope.currentUser.role === "admin" ||($scope.currentUser.role === "moderator" && $scope.currentUser.id === $scope.id)) {
                    $scope.loading = true;
                    // call the create function from our service (returns a promise object)
                    UsersService.update($scope.id, $scope.formData)

                    // if successful creation, call our get function to get all the new users
                        .success(function (data) {
                            $scope.loading = false;
                            $scope.id = 0;
                            $scope.formData = {
                                firstname: "",
                                lastname: "",
                                role: "",
                                domain: "",
                                log_time: "",
                                foto: "",
                                email: "",
                                password: "",
                            }; // clear the form so our user is ready to enter another
                            $scope.users = data.data; // assign our new list of user
                        });
                } else console.log('u cant update user, u are '+ $scope.currentUser.role);
            }
        };

        // DELETE ==================================================================
        // delete a user after checking it
        $scope.deleteUser = function(id) {
            if($scope.currentUser.role === "admin") {
                $scope.loading = true;
                UsersService.deleteUser(id)
                // if successful deleting, call our get function to get all the new users
                    .success(function (data) {
                        $scope.loading = false;
                        $scope.users = data.data;
                    });
            } else console.log('u cant delete user, u are '+ $scope.currentUser.role);
        };
    }]);

//auth-------------------------------------------------------------







/*.controller("LogCtrl", ['$location', '$scope', '$http','Users', '$rootScope', function($location, $scope, $http, $rootScope) {
     console.log("good users");
     $scope.currentUser;
        $scope.check = function() {
            Users.getByEmail($rootScope.currentUser)
                .success(function (data) {
                    console.log(data);
                    $scope.currentUser = data;
                })
    }
}]);*/

