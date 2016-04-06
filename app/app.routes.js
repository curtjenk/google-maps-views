mapsApp.config(function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'homeController',
        templateUrl: function($routeParams) {
            return 'app/components/home/homeView.html';
        }
    });
    $routeProvider.when('/zoom/:cityYearRank', {
        controller: 'zoomController',
        templateUrl: function($routeParams) {
            return 'app/components/zoom/zoom.html';
        }
    });
    $routeProvider.otherwise({
        redirectTo: '/',
    });
});
