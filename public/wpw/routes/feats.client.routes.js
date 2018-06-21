angular.module('feats').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/dashboard', {
            templateUrl: 'wpw/views/dashboard.client.view.html'
        }).
        when('/feats', {
            templateUrl: 'wpw/views/feats.view-all.client.view.html'
        }).
        when('/feats/view/:featId', {
            templateUrl: 'wpw/views/feats.view-one.client.view.html'
        }).
        when('/feats/edit/:featId', {
            templateUrl: 'wpw/views/feats.edit.client.view.html'
        }).
        when('/feats/create', {
            templateUrl: 'wpw/views/feats.create.client.view.html'
        }).
        when('/feats/create/admin', {
            templateUrl: 'wpw/views/feats.create-multi.client.view.html'
        }).
        otherwise({
            redirectTo: '/feats'
        });
    }
]);