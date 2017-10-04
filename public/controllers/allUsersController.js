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
                            $scope.formData.role = "user";
                            console.log($scope.formData);
                            UploadService.upload(files);
                            var foto = null;
                            if(files!=null)
                                for(var i=0;i<files.length ;i++ ){

                                    if (foto != null) {

                                        foto = foto + "," + files[i].name;
                                    } else {
                                        foto =files[i].name;
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
            // UPDATE ==================================================================
            // when submitting the updating form, send the data user to the node API
            $scope.update = function(files) {

                // validate the formData to make sure that something is there
                // if form is empty, nothing will happen
                if ($scope.formData.lastname != "" && $scope.formData.firstname != "") {
                    if($scope.currentUser.role === "admin" ||($scope.currentUser.role === "moderator" && $scope.currentUser.id === $scope.id)) {
                        $scope.loading = true;
                        var email ={
                            email:$scope.formData.email
                        };
                        UploadService.upload(files);
                        if(userEmail == $scope.formData.email){
                            var foto = $scope.formData.foto;
                            if(files!=null)
                                for(var i=0;i<files.length ;i++ ){

                                    if (foto != null) {
                                        foto = foto + "," + files[i].name;
                                    } else {
                                        foto = files[i].name;
                                    }
                                }
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

                                    UploadService.upload(files); //отправляем наши файлы на сервер


                                    if(files!=null)
                                        var foto = $scope.formData.foto;
                                        for(var i=0;i<files.length ;i++ ){
                                            if (foto != null) {
                                                console.log(i);
                                                console.log(foto);
                                                foto = foto + "," + files[i].name;
                                            } else {
                                                foto = files[i].name;
                                            }
                                        }
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
                                            $scope.picFile = null;
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
        }]);