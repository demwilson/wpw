angular.module('character').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/character', {
            templateUrl: 'wpw/views/character.view.html'
        });
    }
]);