angular.module('allControllers')
    .controller('UsersController', ['$scope','$http','$rootScope','$cookieStore','$location','UsersService','Storage','UploadService',
        function($scope, $http, $rootScope, $cookieStore, $location, UsersService, Storage,UploadService) {
            //когда переходим на изменение пользователя
            clearForm();

            if(location.pathname =='/edit'){
                $scope.formData = Storage.getUser();
                $scope.name = Storage.getName();
                if (!$scope.name){
                    $location.url('/users');
                }else {
                    var userEmail = $scope.formData.email;
                    var delArrayPhoto = new Array;
                    if ($scope.formData.foto!=null){
                        $scope.fotoUrl = $scope.formData.foto.split(',');
                        for (var i=0;i<$scope.fotoUrl.length;i++){
                            $scope.fotoUrl[i] = "/static/img/" + $scope.fotoUrl[i];
                        }
                    }

                }
            }
            //$scope.picFile = $scope.upLoadFiles;
            $scope.indexCarousel = null;
            $scope.id = 0;
            $scope.propertyName = 'lastname';
            $scope.reverse = true;
            $scope.loading = true;
            $scope.password = null;
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
            $scope.getByIdForEdit = function(id)
            {$scope.loading = true;
                UsersService.getById(id)
                    .success(function(data) {
                        if($scope.currentUser.role === "admin" || ($scope.currentUser.role === "moderator" && $scope.currentUser.id === id)) {

                            $scope.loading = false;
                            Storage.setUser(data.data);
                            Storage.setName(data.data.firstname + " " + data.data.lastname);
                            $scope.id = id;
                            $location.path('/edit');
                        } else {
                            window.alert("u cant update user information");
                        }

                    });
            };
            $scope.getById = function(id) {

                UsersService.getById(id)
                    .success(function(data) {
                        if($scope.currentUser.role === "admin" ||($scope.currentUser.role === "moderator" && $scope.currentUser.id === id)) {
                        $scope.formData = data.data;
                        $scope.formData.password = null;
                        $scope.id = id;
                        } else {
                            window.alert("u cant reset password ");
                        }
                    });

            };
            // CREATE ==================================================================
            // when submitting the add form, send the data user to the node API
            $scope.create = function(files) {

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
                            if($scope.formData.role ==null){
                                $scope.formData.role = "user";
                            }
                            $scope.formData.log_time = "never signed in"
                            console.log($scope.formData);
                            UploadService.upload(files);
                            var foto = null;
                            if(files!=null)
                                for(var i=0;i<files.length ;i++ ){
                                    var str = files[i].name.split('.');
                                    var name = new Date().getTime() + i + '.' + str[str.length-1];
                                    UploadService.rename(files[i], name);  //переименовываем файл что бы не было повторений
                                    if (foto != null) {
                                        foto = foto + "," + name;
                                    } else {
                                        foto = name;
                                    }
                                }
                            $scope.formData.foto = foto;
                            UsersService.create($scope.formData)

                            // if successful creation, call our get function to get all the new users
                                .success(function() {
                                    console.log('created  person' + $scope.formData.firstname);
                                    $scope.users.push($scope.formData);
                                    $scope.loading = false;
                                    clearForm(); // clear the form so our user is ready to enter another
                                    $scope.picFile = null;
                                });


                        });

                }
            };
            $scope.loadPic = function(files) {
                Upload.upload({
                    url: '/upload',
                    file: files
                }).progress(function(e) {

                }).then(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                    $scope.picFile = null;
                    var foto = null;
                    for(var i=0;i<files.length ;i++ ){

                        if (foto != null) {
                            console.log(i);
                            console.log(foto);
                            foto = foto + " , '" + files[i].name + "'";
                        } else {
                            foto = "'" + files[i].name + "'";
                        }
                    }
                    $scope.formData.foto = foto;
                });
            };
            $scope.cancel = function () {
                          $location.url('/users');
                        };
            // UPDATE ==================================================================
            // when submitting the updating form, send the data user to the node API

            $scope.update = function(files) {
                    console.log($scope.formData);
                    if($scope.currentUser.role === "admin" || ($scope.currentUser.role === "moderator" && $scope.currentUser.id === $scope.formData.id)) {
                        $scope.loading = true;
                        var email ={
                            email:$scope.formData.email
                        };
                        var currUser = {
                            email:$scope.currentUser.email,
                            password:$scope.password
                        };
                        console.log($scope.password);
                        console.log($scope.currentUser.email);
                        UsersService.checkPass(currUser)
                        .success(function(){
                            if(userEmail == $scope.formData.email){
                                var foto = $scope.formData.foto;
                                    if(files!=null)
                                        for(var i=0;i<files.length ;i++ ){
                                            var str = files[i].name.split('.')
                                            var name = new Date().getTime() + i + '.' + str[str.length-1];
                                            UploadService.rename(files[i], name);
                                            /*files[i].name = name.toString(); //зададим файлу уникальное название*/
                                            console.log('file name: ' + name);
                                            if (foto != null) {
                                                foto = foto + "," + name;
                                            } else {
                                            foto = name;
                                            }
                                        }
                                        console.log(files);
                                        UploadService.upload(files);
                                        console.log(foto);
                                        //тут удаляем все фотки, которые были ранее загружены но их решили удалить сейчас
                                        if(delArrayPhoto!=null)
                                        for(var j=0;j<delArrayPhoto.length ;j++ ) {
                                            UsersService.deletePhoto({photoUrl: delArrayPhoto[j]})
                                                .success(function () {
                                                    concole.log('deleted photo ' + delArrayPhoto[j]);
                                            });
                                        }
                                        $scope.formData.foto = foto;
                                        UsersService.update($scope.id, $scope.formData)
                                            .success(function () {
                                                console.log('updated  person' + $scope.formData.firstname);
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
                                                //если почта изменена но введенной почты в базе нет
                                                if(files!=null)
                                                    var foto = $scope.formData.foto;
                                                    for(var i=0;i<files.length ;i++ ){
                                                        var str = files[i].name.split('.')
                                                        var name = new Date().getTime() + i + '.' + str[str.length-1];
                                                        UploadService.rename(files[i], name);  //переименовываем файл что бы не было повторений
                                                        if (foto != null) {
                                                            console.log(i);
                                                            console.log(foto);
                                                            foto = foto + "," + name;
                                                        } else {
                                                            foto = name;
                                                        }
                                                    }
                                                    UploadService.upload(files); //отправляем наши файлы на сервер
                                                    //тут удаляем все фотки, которые были ранее загружены но их решили удалить сейчас
                                                    if(delArrayPhoto!=null)
                                                        for(var j=0;j<delArrayPhoto.length ;j++ ) {
                                                            UsersService.deletePhoto({photoUrl: delArrayPhoto[j]})
                                                                 .success(function () {
                                                                      concole.log('deleted photo ' + delArrayPhoto[j]);
                                                            });
                                                        }
                                                        UsersService.update($scope.id, $scope.formData)
                                                            .success(function () {
                                                                console.log('updated  person' + $scope.formData.firstname);
                                                                Storage.setUser(null);
                                                                Storage.setName(null);
                                                                $scope.picFile = null;
                                                                $location.url('/users');
                                                        });
                                        });
                                    }

                        })
                        .error(function(){
                            window.alert('incorrect password');
                        });


                    } else{
                        console.log('u cant update user, u are '+ $scope.currentUser.role);
                        window.alert('u cant update user, u are '+ $scope.currentUser.role);
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
            //тут формируем массив фоток, которые хотим удалить
            $scope.deletePhoto = function (photoUrl,id) {
                var str = photoUrl.split('/');
                photoUrl = str[3];
                $scope.fotoUrl.splice(id, 1);
                var foto = null;
                if($scope.fotoUrl!=null)
                    for(var i=0;i<$scope.fotoUrl.length ;i++ ){
                        if (foto != null) {
                            console.log(i);
                            console.log(foto);
                            str = $scope.fotoUrl[i].split('/');
                            foto = foto + "," + str[3];
                        } else {
                            str = $scope.fotoUrl[i].split('/');
                            foto = str[3];
                        }
                    }
                $scope.formData.foto = foto;
                delArrayPhoto.push(photoUrl);
                console.log(delArrayPhoto);
                /*UsersService.deletePhoto({photoUrl:photoUrl})
                    .success(function () {
                        concole.log('deleted photo');
                    })*/
            };
            $scope.delUplPhoto = function (id) {
                $scope.picFile.splice(id, 1);
            };
            $scope.setAvatar = function (name) {
              $scope.formData.avatar = name;
              console.log('avatar is ', name);
            };
            $scope.resetPassword = function () {
                UsersService.updatePass($scope.formData.id, $scope.formData)
                    .success(function () {
                        console.log('updated  person' + $scope.formData.firstname);
                    });
            };
            $scope.onUpload = function () {
                console.log("something");
            };
            $scope.applyDomain = function (domain,role) {
                if(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/.test(domain)){

                    $scope.formData.role = role;
                    $scope.formData.domain = domain;

                } else window.alert("domain looks dont like valid");
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
                    avatar:null,
                    email:null,
                    password:null

                }; // clear the form so our user is ready to enter another

            }
        }])
    .directive('passwordConfirm', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            scope: {
                matchTarget: '='
            },
            require: 'ngModel',
            link: function link(scope, elem, attrs, ctrl) {
                var validator = function (value) {
                    ctrl.$setValidity('match', value === scope.matchTarget);
                    return value;
                };

                ctrl.$parsers.unshift(validator); //$parsers определяют как значения из вью будет записаны в модель
                ctrl.$formatters.push(validator);//$formatters определяют как модель будет представлена во вью

                // This is to force validator when the original password gets changed
                scope.$watch('matchTarget', function(newval, oldval) {
                    validator(ctrl.$viewValue);
                });

            }
        };
    }])
    .directive('domain', function () {
    var isValid = function(s) {
        return /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/.test(s);
    };

    return {
        require:'ngModel',
        link:function (scope, elm, attrs, ngModelCtrl) {

            ngModelCtrl.$parsers.unshift(function (viewValue) {
                ngModelCtrl.$setValidity('domain', isValid(viewValue));
                return viewValue;
            });

            ngModelCtrl.$formatters.unshift(function (modelValue) {
                ngModelCtrl.$setValidity('domain', isValid(modelValue));
                return modelValue;
            });
        }
    };
});