/**
 * This controller handles the fetching and displaying of all feats in the database.
 */
angular.module('feats').controller('featsViewAllController', ['$scope', '$routeParams', '$location', 'Feat',
    function($scope, $routeParams, $location, Feat) {
        /**
         * Creates a string of all the prerequisites required for a feat based on the prerequisites array.
         * @param arr {Array} The array of objects to have the types pulled out and placed into a string.
         * @returns {string} The newly created string of the types from the objects in the array.
         */
        $scope.listPrerequisites = function(arr) {
            var str, item;
            str = '';
            // Pull the name from each object in the array
            for ( item in arr ) {
                if ( !arr.hasOwnProperty(item) ) { continue; }

                if ( arr[item].hasOwnProperty('text')) {
                    str += arr[item].text + ', ';
                }
            }

            // Remove the comma and space at the end of the string before sending it back
            str = str.replace(/, $/, '');

            return str;
        };

        /**
         * Makes a call to the web server to retrieve all the feats in the database.
         */
        $scope.feats = Feat.query();
    }
]);

/**
 * This controller handles the displaying of one feat to be viewed in full detail.
 */
angular.module('feats').controller('featsViewOneController', ['$scope', '$routeParams', '$location', 'Feat',
    function($scope, $routeParams, $location, Feat) {
        /**
         * Makes a call to the server to retrieve the feat information based on the ID given in the hash parameters.
         */
        $scope.feat = Feat.get({
            featId: $routeParams.featId
        });

        /**
         * Deletes a given feat from the database. If no feat is given, it'll delete the feat found in the $scope.
          */
        $scope.delete = function(feat) {
            if (feat) {
                feat.$remove(function() {
                    delete $scope.feat;
                });
            } else {
                $scope.feat.$remove(function() {
                    $location.path('/feats');
                });
            }
        };
    }
]);

/**
 * This controller handles the creation of a new feat through a form and saving it to the database via the web server.
 * NOTE: You must be logged in to create a feat.
 */
angular.module('feats').controller('featsCreateController', ['$scope', '$location', 'Feat',
    function($scope, $location, Feat) {
        // If the user is not logged in and we are in the create display
        if ( !$scope.authentication.user) {
            // Jump back to the list of feats if we are not supposed to be here
            $location.path('/feats');
        }
        $scope.feat = new Feat();

        // Creates a new feat using the data from $scope
        $scope.create = function() {
            // Allows the user to save the data to the database when the create feat button is clicked
            $scope.feat.$save(function(response) {
                $location.path('feats/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

/**
 * This controller handles the creation of multiple feats at a time submitted via ajax to the web server and
 * saving it to the database.
 */
angular.module('feats').controller('featsCreateMultiController', ['$scope', '$location', '$http',
    function($scope, $location, $http) {
        // If the user is not logged in and we are in the create display
        if ( !$scope.authentication.user) {
            // Jump back to the list of feats if we are not supposed to be here
            $location.path('/feats');
        }

        // Creates a new feat using the data from $scope
        $scope.createMultiFeats = function() {
            $http({
                url: "api/feats/createMultiFeats",
                method: "POST",
                data: $scope.featData
            }).success(function(successResponse) {
                $scope.error = 'Your feats have been POST\'d.';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

/**
 * This controller handles the editing and resaving of an existing feat pulled from the database.
 */
angular.module('feats').controller('featsEditController', ['$scope', '$routeParams', '$location', 'Feat',
    function($scope, $routeParams, $location, Feat) {
        // If the user is not logged in and we are in the edit display
        if ( !$scope.authentication.user ) {
            // Jump back to the list of feats if we are not supposed to be here
            $location.path('/feats');
        }

        /**
         * Compares the logged in user's ID to the feat creator's ID to redirect those who just changed the URL
         * from view/ to edit/ from getting the page without more effort.
         * @param feat {Feat} The feat returned from the web server based on the ID provided in the findOne function
         */
        function confirmCreator(feat) {
            if ( $scope.authentication.user._id != feat.creator._id ) {
                $location.path('/feats');
            }
        }

        /**
         * Makes a call to the server to retrieve the feat information  based on the ID given in the hash parameters. On
         * a successful return from the web server, it then calls a function to prevent the edit content from loading,
         * if they're not the creator of the feat they are trying to edit.
         */
        $scope.findOne = function() {
            $scope.feat = Feat.get({
                featId: $routeParams.featId
            }, confirmCreator);
        };

        /**
         * Sends the changes made in the form back to the web server to be saved.
         */
        $scope.update = function() {
            $scope.feat.$update(function() {
                $location.path('feats/view/' + $scope.feat._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.findOne();
    }
]);