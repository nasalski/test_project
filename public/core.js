
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
            .when('/new_pass', {
                templateUrl: 'static/newpass.html',
                controller: 'NewPassCtrl'
            })
            .when('/notfound', {
                templateUrl: 'static/notfound.html'
            })
            .when('/add_new', {
                templateUrl: 'static/add_new.html',
                controller: 'UsersController'
            })
            .otherwise({ redirectTo: '/notfound' });

        $locationProvider.html5Mode(true);
    }])
     .run(['$rootScope', '$location','$cookieStore', function ($rootScope, $location,$cookieStore) {
        $rootScope.currentUser = $cookieStore.get('currentUser');
        // register listener to watch route changes

        /*$cookieStore.put('currentUser',null);*/
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            $cookieStore.put('currentUser', $rootScope.currentUser);

                console.log(next.templateUrl);
            if ($rootScope.currentUser == null) {
                console.log("мы не авторизированы");
                if (next.templateUrl == "static/auth.html") {
                    console.log("мы не авторизированы");
                } else if (next.templateUrl == "static/register.html")
                    {
                    // not going to #login, we should redirect now
                   /* $location.path("/signup");*/
                   console.log("идем регистрироваться");
                } else
                    if(next.templateUrl == "static/forg.html") {
                        console.log("идем вспоминать пароль");
                    } else if(next.templateUrl == "static/newpass.html") {
                        console.log("восстанавливаем пароль");
                    } else
                        {
                            console.log("другой путь, кидаем на авторизацию");
                            $location.path("/signin");
                        }

            } else {
                console.log($rootScope.currentUser);
                if (next.templateUrl == "static/auth.html"){
                    $location.path("/users");
                }
            }

        });
    }]);


