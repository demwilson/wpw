var appName = 'mean';
var app = angular.module(appName, ['ngResource', 'ngRoute', 'users', 'feats', 'character']);

app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('!');
}
]);

if (window.location.hash === '#_=_') window.location.hash = '#!';

angular.element(document).ready(function () {
    angular.bootstrap(document, [appName]);
});
function removeFromArray(arr, value) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === value) {
            // Remove the value and be done
            arr.splice(i, 1);
            return true;
        }
    }
    return false;
}
function getArrayPosition(arr, value, options) {
    var i, currentValue;
    i = arr.length;
    if (typeof options === 'undefined') {
        options = {};
    }
    // If no value is given,
    if (typeof value === 'undefined' || value === null) {
        // return no match.
        return -1;
    }
    // If we are ignoring the case,
    if (options.ignoreCase) {
        // lowercase the value we are looking for
        value = value.toLowerCase();
    }
    // Starting at the back of the array,
    while (i--) {
        // get current value
        currentValue = arr[i];
        // If current value is not a string,
        if (typeof currentValue !== 'string') {
            // If current value is an object,
            // TODO: allow comparison of nested object properties in the parent object
            if (typeof currentValue === 'object' && isArray(currentValue) === false) {
                // and if the targeted property exists
                if (typeof options.targetProperty !== 'undefined') {
                    // get the targeted property for comparison.
                    currentValue = currentValue[options.targetProperty];
                }
            } else {
                // If the value is not an object, skip it
                continue;
            }
        }
        // If we are ignoring the case,
        if (options.ignoreCase) {
            // lowercase our current value
            currentValue = currentValue.toLowerCase();
        }
        // If we are allowing partial comparisons,
        if (options.partial) {
            // and if we find find a partial match,
            if (currentValue.indexOf(value) > -1) {
                // return the given position.
                return i;
            }
        } else {
            // If we are not allowing partial comparisons,
            // and if the values match exactly,
            if (currentValue === value) {
                // return the given position.
                return i;
            }
        }
    }
    return -1;
}

function isArray(testObj) {
    return Object.prototype.toString.call(testObj) === '[object Array]';
}

/**
 * Determines if there is a selection placeholder in the given string.
 * @param {string} testStr - The string to check for selection placeholders.
 * @returns {boolean} True if at least one is found, otherwise false.
 */
function isSelection(testStr) {
    return (typeof testStr === 'string' && testStr.indexOf("{{") !== -1 && testStr.indexOf("}}") !== -1);
}

/**
 * Takes a given string, and replaces selection placeholders with the selection value.
 * @param {string} value - The string containing selection placeholders.
 * @param {array} arrSelections - The array of selections to be placed in the value parameter.
 * @returns {string|null} If successful, the new string is returned, otherwise null.
 */
function makeSelectionSubstitution(value, arrSelections) {
    var positionInArray, startBrace, endBrace, identifier;
    // Determine the location of the first substitution to be made
    startBrace = value.indexOf('{{');
    endBrace = value.indexOf('}}');
    // Get the actual identifier, so we can get the correct selection
    identifier = value.substr(startBrace, (endBrace-startBrace+2));
    positionInArray = identifier.replace(/{|}/g, '');
    positionInArray = parseInt(positionInArray);
    // If the number could not be parsed, something is wrong with the formula string
    if (isNaN(positionInArray) === true) {
        console.log('makeSelectionSubstitution - The selection value could not be parsed.\nActual Value: ' + identifier);
        return null;
    }
    // Replace the value with the selection
    value = value.replace(identifier, arrSelections[positionInArray]);
    // If there are more substitutions to be made,
    if (value.indexOf('{{') > -1 && value.indexOf('{{')  > -1) {
        // return after all substitutions are completed
        return makeSelectionSubstitution(value, arrSelections);
    }
    // return the newly compiled value
    return value;
}
function parseFormula(formulaSection, prev, selections, command) {
    var formulaPropertyName, charPropertyName, currentValue, i;
    if (typeof prev === 'undefined' || typeof formulaSection === 'undefined') {
        return false;
    }
    for (formulaPropertyName in formulaSection) {
        // We access the same properties on the character that we do in the formula
        charPropertyName = formulaPropertyName;
        // Property
        // If the property is a selection value, we need to get the selection value before we continue
        if (isSelection(formulaPropertyName)) {
            // Since this a selection value, we'll be targeting a different property on the character than in the formula
            charPropertyName = makeSelectionSubstitution(formulaPropertyName, selections);
        }
        // If the property is a function in the character object, call the function with the value as the parameter
        if (typeof prev[charPropertyName] === 'function') {
            // If we are removing content, swap add to remove
            if (command === 'remove') {
                switch (charPropertyName) {
                    case 'add':
                        charPropertyName = 'remove';
                        break;
                }
            }
            forceSubstitutions(formulaSection[formulaPropertyName], selections);
            prev[charPropertyName](formulaSection[formulaPropertyName]);
            continue;
        }

        // Property Value
        // Array, we need to add to existing array, or set the object
        if (isArray(formulaSection[formulaPropertyName])) {
            if (typeof prev[charPropertyName] === 'undefined' || prev[charPropertyName] === null) {
                prev[charPropertyName] = [];
            }
            // If we need to remove content,
            if (command === 'remove') {
                // Remove each item in the array from the character array
                for (i = 0; i < formulaSection[formulaPropertyName].length; ++i) {
                    currentValue = formulaSection[formulaPropertyName][i];
                    //If this value is from the selection, we add the selection value instead
                    if (isSelection(currentValue)) {
                        currentValue = makeSelectionSubstitution(currentValue, selections);
                    }
                    removeFromArray(prev[charPropertyName], currentValue);
                }
                continue;
            }
            // Add each item in the formula array to the existing character array
            for (i = 0; i < formulaSection[formulaPropertyName].length; ++i) {
                currentValue = formulaSection[formulaPropertyName][i];
                //If this value is from the selection, we add the selection value instead
                if (isSelection(currentValue)) {
                    currentValue = makeSelectionSubstitution(currentValue, selections);
                }
                prev[charPropertyName].push(currentValue);
            }
            continue;
        }
        // Object, we need to go deeper
        if (typeof formulaSection[formulaPropertyName] === 'object') {
            // If the property doesn't exist on the character, create it with the formula content, and we are done
            if (typeof prev[charPropertyName] === 'undefined' || prev[charPropertyName] === null) {
                prev[charPropertyName] = formulaSection[formulaPropertyName];
                continue;
            }
            // Do this for each property within this property
            parseFormula(formulaSection[formulaPropertyName], prev[charPropertyName], selections, command);
            continue;
        }
        // String, set the value
        if (typeof formulaSection[formulaPropertyName] === 'string') {
            // For each item in the array, we add it to the existing array
            if (command === 'remove'){
                prev[charPropertyName] = null;
                continue;
            }
            if (command === 'compare') {

            }
            currentValue = formulaSection[formulaPropertyName];
            //If this value is from the selection, we add the selection value instead
            if (isSelection(currentValue)) {
                currentValue = makeSelectionSubstitution(currentValue, selections);
            }
            prev[charPropertyName] = currentValue;
        }
    }
    return true;
}
function forceSubstitutions(formulaSection, selections) {
    var formulaPropertyName;
    for (formulaPropertyName in formulaSection) {
        // If the property is a selection value,
        if (isSelection(formulaPropertyName)) {
            // update the property name
            formulaPropertyName = makeSelectionSubstitution(formulaPropertyName, selections);
        }
        // If the value of the property is a selection value,
        if (isSelection(formulaSection[formulaPropertyName])) {
            // update the value
            formulaSection[formulaPropertyName] = makeSelectionSubstitution(formulaSection[formulaPropertyName], selections);
        } else if (typeof formulaSection[formulaPropertyName] === 'object') {
            // If the value of the property is an object, force substitutions on that object
            formulaSection[formulaPropertyName] = forceSubstitutions(formulaSection[formulaPropertyName], selections);
        }
    }
    return formulaSection;
}