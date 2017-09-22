
angular.module('controller', [])

// inject the service factory into our controller
    .controller('mainController', ['$scope','$http','Users', function($scope, $http, Users) {
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

        // SORTING table by lastname and firstname ========================
        $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        // GET =====================================================================
        // when landing on the page, get all users and show them
        // use the service to get all the users
        Users.get()
            .success(function(data) {
                $scope.users = data.data;
                $scope.loading = false;
            });

        // GET =====================================================================
        // when landing on the page, get all users and show them
        // use the service to get all the users
        $scope.getById = function(id)
            {$scope.loading = true;
                Users.getById(id)
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
            if ($scope.formData.lastname != "" && $scope.formData.firstname != "") {
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Users.create($scope.formData)

                // if successful creation, call our get function to get all the new users
                    .success(function(data) {
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
                $scope.loading = true;
                // call the create function from our service (returns a promise object)
                Users.update($scope.id, $scope.formData)

                // if successful creation, call our get function to get all the new users
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.id = 0;
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

        // DELETE ==================================================================
        // delete a user after checking it
        $scope.deleteUser = function(id) {
            $scope.loading = true;
            Users.deleteUser(id)
            // if successful deleting, call our get function to get all the new todos
                .success(function(data) {
                    $scope.loading = false;
                    $scope.users = data.data;
                });
        };
    }]);