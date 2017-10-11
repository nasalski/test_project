angular.module('allControllers')
    .controller('SignInCtrl',['$location', '$scope', '$http', '$rootScope','UsersService', function($location, $scope, $http, $rootScope,UsersService) {
        /*console.log("yep");*/
        $scope.login = function(user) {
            /*console.log(user.email);*/
            UsersService.login(user)
                .success(function(data,docs,inf,bla) {
                    if(docs==200){
                        console.log(inf);
                        console.log(bla.data);
                        console.log(docs);
                        console.log("im here");
                        $rootScope.currentUser = user.email;
                        /*$rootScope.isAuth = true;*/
                        $location.url("/users");

                    } else window.alert('incorrect email or password');
                })
                .error(function(){
                        window.alert('incorrect email or password');
                });
        };
        $scope.register = function() {
            console.log("are u want to register?");
            $location.url("/signup");
            }

        $scope.forgotPass = function() {
            console.log("are u forgot your pass?");
            $location.url("/forg");

        }


    }]);