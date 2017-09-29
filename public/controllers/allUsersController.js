angular.module('allControllers')
    .controller('UsersController', ['$scope','$http','$rootScope','$cookieStore','$location','UsersService',
        function($scope, $http, $rootScope, $cookieStore, $location, UsersService) {
            clearForm();
            $scope.id = 0;
            $scope.propertyName = 'lastname';
            $scope.reverse = true;
            $scope.loading = true;
            $scope.email={
                email:$rootScope.currentUser.email
            };

            console.log($scope.currentUser);
            // SORTING table by lastname and firstname ========================
            $scope.sortBy = function(propertyName) {
                $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
                $scope.propertyName = propertyName;
            };
            //update log_time and put to server
            UsersService.getByEmail($scope.email)
                .success(function (data) {
                    $scope.currentUser = data.data;
                    var now = new Date();
                    $scope.currentUser.log_time = now;
                    UsersService.update($scope.currentUser.id, $scope.currentUser );

                });

            // GET =====================================================================
            // when landing on the page, get all users and show them
            // use the service to get all the user
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

                    // call the create function from our service (returns a promise object)
                    UsersService.create($scope.formData)

                    // if successful creation, call our get function to get all the new users
                        .success(function() {
                            console.log('created  person' + $scope.formData.firstname);
                            $scope.users.push($scope.formData);
                            $scope.loading = false;
                            clearForm(); // clear the form so our user is ready to enter another
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

                        // if successful creation, update users array
                            .success(function () {
                                for (var i = 0; i < $scope.users.length; i++) {
                                    if ($scope.users[i].id == $scope.id) $scope.users[i] = $scope.formData;
                                }
                                $scope.loading = false;
                                $scope.id = 0;
                                clearForm(); // clear the form so our user is ready to enter another
                            });

                    } else{
                        console.log('u cant update user, u are '+ $scope.currentUser.role);
                        window.alert('u cant update user, u are '+ $scope.currentUser.role);
                    }
                }
            };

            // DELETE ==================================================================
            // delete a user after checking it
            $scope.deleteUser = function(id,index) {
                if($scope.currentUser.role === "admin") {
                    $scope.loading = true;

                    UsersService.deleteUser(id)
                    // if successful deleting, call our get function to get all the new users
                        .success(function () {
                            for (var i = 0; i < $scope.users.length; i++) {
                                if ($scope.users[i].id == id) $scope.users.splice(i, 1);
                            }
                            $scope.loading = false;

                        });
                } else {
                    window.alert('u cant delete user, u are '+ $scope.currentUser.role);
                    console.log('u cant delete user, u are '+ $scope.currentUser.role);
                }
            };
            $scope.logout = function () {
                console.log('logout');
                window.alert("u're logged out");
                $cookieStore.put('currentUser', null);
                $location.path('/signin');

            }
            function clearForm() {
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

                }; // clear the form so our user is ready to enter another

            }
        }]);