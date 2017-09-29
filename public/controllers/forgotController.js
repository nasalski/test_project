angular.module('allControllers')
    .controller('ForgCtrl',['$location', '$scope', '$http', '$rootScope','UsersService', function($location, $scope, $http, $rootScope,UsersService) {
    console.log("forgot pass controller");
    function clearForm() {
        $scope.formData = {
            email: null,
        };
    }
    clearForm();
    $scope.sendPassword = function() {
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        console.log('i want send password');
        $scope.email = {
            email:$scope.formData.email
        };
        if ($scope.email != "") {
            console.log($scope.formData.email + " проверим почту");
            UsersService.getByEmail($scope.email)
                .success(function () {
                    console.log();
                    window.alert('такая почта есть');
                    //здесь мы отправим письмо на указанную почту
                    clearForm();
                })
                .error(function () {
                    window.alert('такой почты нет');
                    clearForm();
                })
            // call the create function from our service (returns a promise object)

        } else {
            window.alert('empty inputs');
        }



    }
}]);