/**
 * This controller determines which section of the HTML should be displayed.
 */
angular.module('users').controller('userController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        // Store the authentication information for the user
        $scope.authentication = Authentication;
    }
]);