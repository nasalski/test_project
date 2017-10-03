angular.module('allControllers', [])
    .controller('SignUpCtrl',['$location', '$scope', '$http', '$rootScope','UsersService', function($location, $scope, $http, $rootScope,UsersService) {
        console.log("register controller");

        $scope.clearForm = function() {
            $scope.formData = {
                id: null,
                firstname:null,
                lastname:null,
                nickname:null,
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





        }




    }])
    .controller('SignInCtrl',['$location', '$scope', '$http', '$rootScope', function($location, $scope, $http, $rootScope) {
        /*console.log("yep");*/
        $scope.login = function(user) {
            /*console.log(user.email);*/
            $http.post('/signin', user)
                .success(function(data,docs) {
                    if(docs==200){
                        console.log("im here");
                        $rootScope.currentUser = user.email;
                        $rootScope.isAuth = true;
                        $location.url("/users");

                    } else window.alert('incorrect email or password');
                });
        };
        $scope.register = function() {
            console.log("are u want to register?");
            $http.get('/signup')
                .success(function () {
                    console.log("and now??");
                    $location.url("/signup");
                })
        };

        $scope.forgotPass = function() {
            console.log("are u forgot your pass?");
            $http.get('/forg')
                .success(function () {
                    console.log("and now??");
                    $location.url("/forg");
                })
        }


    }])
    .controller('UsersController', ['$scope','$http','$rootScope','$cookieStore','$location','UsersService','Storage',
    function($scope, $http, $rootScope, $cookieStore, $location, UsersService, Storage) {
        $scope.formData = Storage.getUser();

        $scope.name = Storage.getName();
        if(location.pathname =='/edit'){
            if (!$scope.name){
                $location.url('/users');
            }else var userEmail = $scope.formData.email;
        }

        $scope.id = 0;
        $scope.propertyName = 'lastname';
        $scope.reverse = true;
        $scope.loading = true;
        $scope.email={
            email:$rootScope.currentUser
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
                    if($scope.currentUser.role === "admin" ||($scope.currentUser.role === "moderator" && $scope.currentUser.id === $scope.id)) {
                        $scope.loading = false;
                        Storage.setUser(data.data);
                        Storage.setName(data.data.firstname + " " + data.data.lastname);
                        $scope.id = id;
                        $location.path('/edit');
                    } else {
                        window.alert("u cant update user information");
                    }

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
                var email ={
                    email:$scope.formData.email
                };
                UsersService.getByEmail(email)
                    .success(function () {
                        window.alert("email is already in use")
                    })
                    .error(function () {
                        $scope.formData.role = "user";
                        UsersService.create($scope.formData)

                        // if successful creation, call our get function to get all the new users
                            .success(function() {
                                console.log('created  person' + $scope.formData.firstname);
                                $scope.users.push($scope.formData);
                                $scope.loading = false;
                                clearForm(); // clear the form so our user is ready to enter another
                            });
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
                    var email ={
                        email:$scope.formData.email
                    };
                    if(userEmail == $scope.formData.email){
                        UsersService.update($scope.id, $scope.formData)
                            .success(function () {
                                Storage.setUser(null);
                                Storage.setName(null);
                                $location.url('/users');
                            });
                    } else{
                        UsersService.getByEmail(email)
                            .success(function () {
                                window.alert("email is already in use")
                            })
                            .error(function () {
                                UsersService.update($scope.id, $scope.formData)
                                    .success(function () {
                                        Storage.setUser(null);
                                        Storage.setName(null);
                                        $location.url('/users');
                                    });
                            });
                    }

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
            $rootScope.currentUser=null;
            $cookieStore.put('currentUser', null);
            $location.path('/signin');

        };
        $scope.addNew = function () {
            if($scope.currentUser.role === "admin"){
                clearForm();
                console.log("i want add new user");
                $location.path('/add_new');
            } else {
                window.alert("u're not admin");
            }

        };
        function clearForm() {
            $scope.formData = {
                id: null,
                firstname:null,
                lastname:null,
                nickname:null,
                role:null,
                domain:null,
                log_time:null,
                foto:null,
                email:null,
                password:null

            }; // clear the form so our user is ready to enter another

        }
    }])
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
    }])
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
        }])
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