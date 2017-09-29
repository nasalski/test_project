
angular.module('core', ['allControllers', 'usersService','ngRoute', 'ngCookies'])

    .config(['$routeProvider','$locationProvider', '$httpProvider', function ($routeProvider,$locationProvider, $httpProvider) {
        $routeProvider
            .when('/signin', {
                templateUrl: 'static/auth.html',
                controller: 'SignInCtrl',
                hideMenus: true
            })
            .when ('/forg', {
                templateUrl: 'static/forg.html',
                controller: 'ForgCtrl'
            })
            .when('/signup', {
                templateUrl: 'static/register.html',
                controller: 'SignUpCtrl'
            })

            .when('/users', {
                templateUrl: 'static/users.html',
                controller: 'UsersController'
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
    }])
     .run(['$rootScope', '$location','$cookieStore', function ($rootScope, $location,$cookieStore) {
        $rootScope.currentUser = $cookieStore.get('currentUser');
        // register listener to watch route changes
        /*console.log(next.templateUrl);*/
        /*$cookieStore.put('currentUser',null);*/
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            $cookieStore.put('currentUser', $rootScope.currentUser);


            if ($rootScope.currentUser == null) {
                if (next.templateUrl == "/static/auth.html") {

                } else if (next.templateUrl = "/static/register.html")
                    {
                    // not going to #login, we should redirect now
                    $location.path("/signup");
                } else $location.path("/signin");
            }

        });
    }]);


