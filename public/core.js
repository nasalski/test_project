
angular.module('core', ['allControllers', 'usersService','ngRoute', 'ngCookies'])

    .config(['$routeProvider','$locationProvider', '$httpProvider', function ($routeProvider,$locationProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'static/auth.html',//'/static/view/auth.html',
                controller: 'AuthCtrl',
                hideMenus: true,

            })

            .when('/users', {
                templateUrl: 'static/users.html',//'/users',
                controller: 'usersController',
            })

            .otherwise({ redirectTo: '/signup' });

        $locationProvider.html5Mode(true);
    }])
    .run( function($rootScope, $location) {
        console.log($location);
        // register listener to watch route changes
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            if ( $rootScope.currentUser == null ) {
                // no logged user, we should be going to #login
                if ( next.templateUrl == "/" ) {
                    // already going to #login, no redirect needed
                } else {
                    // not going to #login, we should redirect now
                    $location.path( "/" );
                }
            } else {
                $location.path( "/users" );
            }
        });
    });
    /*.run(['$rootScope', '$location', '$cookieStore', '$http',
        function ($rootScope, $location, $cookieStore, $http) {
            // keep user logged in after page refresh
            $rootScope.globals = $cookieStore.get('globals') || {};
            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            }

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in
                if ($location.path() !== '/' && !$rootScope.globals.currentUser) {
                    $location.path('/');
                }
            });
        }]);*/
