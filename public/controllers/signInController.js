angular.module('allControllers')
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


    }]);