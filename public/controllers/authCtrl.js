angular.module('authCtrl', [])
.controller('authCtrl',['$location', '$scope', '$http', '$rootScope', function($location, $scope, $http, $rootScope) {
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


}]);
