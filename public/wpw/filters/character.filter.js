/**
 * Determines the ability modifier bonus for a given number.
 */
angular.module('character').filter('abilityModifier', function () {
    return function (abilityScore) {
        var score, str;
        score = parseInt(abilityScore);
        str = '';
        if (isNaN(score)) {
            return false;
        }
        score = math.floor(( abilityScore - 10 ) / 2);
        if (score < 0) {
            str = score;
        } else if (score === 0) {
            str = '+0';
        } else {
            str = '+' + score;
        }

        return str;
    };
});
/**
 * Capitalizes the first letter of the given string.
 */
angular.module('character').filter('capitalize', function () {
    return function (input) {
        var out;
        out = input;
        if (typeof input === 'string') {
            out = (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
        return out;
    };
});
/**
 * Adds a plus sign if the number is zero (0) or higher.
 */
angular.module('character').filter('plusSign', function () {
    return function (input) {
        var out;
        out = parseInt(input);
        if (isNaN(out)) {
            return '--';
        }
        if (out > -1) {
            out = '+' + input;
        }
        return out;
    };
});
angular.module('character').filter('spellsForSpellLevel', function () {
    return function (input) {
        var value, strMath;
        if (input < 0) {
            strMath = "floor(" + input + ")";
        } else {
            strMath = "ceil(" + input + ")";
        }
        value = math.eval(strMath);
        if (value < 0) {
            return '-';
        }
        return value;
    };
});
angular.module('character').filter('shortenAlignment', function () {
    return function (input) {
        var out, arr, i, current;
        out = [];
        arr = input.split(' ');
        for (i = 0; i < arr.length; ++i) {
            current = arr[i];
            out.push(current[0]);
        }
        out = out.join('');
        // Handle true neutral, it should just be N
        if (out === "TN") {
            out = "N";
        }
        return out;
    };
});
angular.module('character').filter('shortenSize', function () {
    return function (input) {
        if (typeof input !== 'string') {
            return '';
        }
        return input[0];
    };
});
angular.module('character').filter('limitCharacters', function () {
    return function (input) {
        var out;
        out = input;
        if (out.length > 24) {
            out = out.substr(0, 21) + '...';
        }
        return out;
    };
});
angular.module('character').filter('limitCharactersDropDown', function () {
    return function (input) {
        var out;
        out = "Selection Required";
        if (typeof input === 'string') {
            out = input;
            if (out.length > 24) {
                out = out.substr(0, 21) + '...';
            }
        }
        return out;
    };
});

angular.module('character').filter('ignoreFunctions', function () {
    return function (input) {
        var out;
        out = [];
        angular.forEach(input, function (value, name) {
            if (typeof value !== 'function') {
                value.name = name;
                out.push(value);
            }
        });
        return out;
    };
});
angular.module('character').filter('onlyWithRanks', function () {
    return function (input) {
        var out, str;
        out = [];
        angular.forEach(input, function (skillInfo, skillName) {
            str = '';
            if (typeof skillInfo !== 'function' &&
                skillInfo.value('ranks')) {
                skillInfo.name = skillName;
                out.push(skillInfo);
            }
        });
        return out;
    };
});
angular.module('character').filter('calculateMath', function ($rootScope) {
    return function (input) {
        var out;
        // If there is no formula,
        if (typeof input !== 'string') {
            // there is nothing to do.
            return input;
        }
        out = math.eval(input, $rootScope.character);
        return out;
    };
});
angular.module('character').filter('removeHiddenNoSelection', function () {
    return function (input) {
        var i, out, current;
        out = [];
        for (i = 0; i < input.length; ++i) {
            current = input[i];
            // If the element is hidden and it doesn't require choices, hide it.
            //If there are choices, they need to be able to view it to change them.
            if (current.hide && !current.choices) {
                continue;
            }
            out.push(current);
        }
        return out;
    };
});
angular.module('character').filter('appendPlace', function () {
    return function (input) {
        var out, value;
        out = '';
        value = parseInt(input);
        if (isNaN(value)) {
            return input;
        }
        switch (value) {
            case 1:
                out = value + 'st';
                break;
            case 2:
                out = value + 'nd';
                break;
            case 3:
                out = value + 'rd';
                break;
            default:
                out = value + 'th';
        }
        return out;
    };
});
angular.module('character').filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});
angular.module('character').filter('checkCard', function () {
    return function (input, options) {
        var out, i, card;

        out = [];
        for (i = 0; i < input.length; ++i) {
            card = input[i];

            // If the card is active, and
            // the show all options or the card is not hidden,
            if (card.active &&
                (options.showall || !card.hide)) {
                // add the card.
                out.push(card);
            }
        }
        return out;
    };
});
angular.module('character').filter('itemHasProperty', function () {
    return function (input) {
        var out;
        out = input;
        if (typeof input === 'undefined' || (isArray(input) && input.length === 0)) {
            out = '-';
        }
        return out;
    };
});
angular.module('character').filter('parseItemWeight', function () {
    return function (input) {
        var out;
        out = input;
        if (typeof input === 'number') {
            out += ' lbs';
        }
        return out;
    };
});
angular.module('character').filter('parseItemRange', function () {
    return function (input) {
        var out;
        out = input;
        if (typeof input === 'number') {
            out += ' ft.';
        }
        return out;
    };
});
angular.module('character').filter('parseItemCost', function () {
    return function (input) {
        var out, displayedType, coinTypes;
        out = input;
        // If it's not a number, we have no idea what's going on.
        if (typeof input !== 'number') {
            // return whatever they gave us.
            return out;
        }
        coinTypes = ['gp', 'sp', 'cp'];
        displayedType = 0;
        while (out > 0 && out < 1 && displayedType < 3) {
            out *= 100;
            displayedType++;
        }
        out += ' ' + coinTypes[displayedType];
        return out;
    };
});