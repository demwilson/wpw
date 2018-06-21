// Services
angular.module('feats').factory('Prerequisite', function() {
    return function() {
        this.text = '';
        this.conditional = '';
    };
});

angular.module('feats').factory('Modifier', function() {
    return function() {
        this.type = '';
        this.formula = '';
        this.conditional = '';
    };
});

angular.module('feats').factory('Feat', ['$resource', 'Prerequisite', 'Modifier',
    function($resource, Prerequisite, Modifier) {
        var feat;

        /**
         * Uses the Angular resource object to create simple CRUD operations.
         * Operations available: get, query, save, remove, delete
         *
         * Use the id defined in the hash URL as the default feat ID, and when $update is called, use PUT
         */
        feat = $resource('api/feats/:featId', {
            featId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });

        // Default values required
        feat.prototype.name = '';
        feat.prototype.types = [];
        feat.prototype.flavor_text = '';
        feat.prototype.benefit = '';
        feat.prototype.normal = '';
        feat.prototype.special = '';
        feat.prototype.requires_value = false;
        feat.prototype.source = '';
        feat.prototype.url = '';
        feat.prototype.prerequisites = [];
        feat.prototype.modifiers = [];

        /**
         * Adds a blank string to the types array of the feat.
         */
        feat.prototype.addType = function() {
            this.types.push('');
        };
        /**
         * Removes an existing type from the array of types for the current feat.
         * @param index {number} The index location to remove in the types array.
         * @return {boolean} True if successful, otherwise false.
         */
        feat.prototype.removeType = function(index) {
            if ( index >= this.types.length ) {
                return false;
            }
            this.types.splice(index, 1);
            return true;
        };

        /**
         * Adds a Prerequisite object to the prerequisites array of the feat.
         */
        feat.prototype.addPrerequisite = function() {
            this.prerequisites.push(new Prerequisite());
        };
        /**
         * Removes an existing prerequisite from the array of prerequisites for the current feat.
         * @param index {number} The index location to remove in the prerequisites array.
         * @return {boolean} True if successful, otherwise false.
         */
        feat.prototype.removePrerequisite = function(index) {
            if ( index >= this.prerequisites.length ) {
                return false;
            }
            this.prerequisites.splice(index, 1);
            return true;
        };

        /**
         * Adds a Modifier object to the modifiers array.
         */
        feat.prototype.addModifier = function() {
            this.modifiers.push(new Modifier());
        };
        /**
         * Removes an existing modifier from the array of modifiers for the feat based on the given index.
         * @param index {number} The index location to remove in the modifiers array.
         * @return {boolean} True if successful, otherwise false.
         */
        feat.prototype.removeModifier = function(index) {
            if ( index >= this.modifiers.length ) {
                return false;
            }
            this.modifiers.splice(index, 1);
            return true;
        };

        return feat;
    }
]);