/**
 * This controller handles the fetching and displaying of all feats in the database.
 */
angular.module('character').controller('characterController', ['$rootScope', '$scope', '$http', '$uibModal', 'Character', 'IssueHandler', 'PathfinderService', 'Viewer', 'filterFilter',
    function ($rootScope, $scope, $http, $uibModal, Character, IssueHandler, PathfinderService, Viewer, filterFilter) {
        $rootScope.character = new Character();
        // Initialize the character
        $rootScope.character.init();
        $rootScope.MathService = math;
        $rootScope.PathfinderService = PathfinderService;
        $scope.selectedQuality = null;
        $scope.selectedCaldb = null;
        // Work around for counting up to a number in ng-repeat in AngularJS
        // SEE: http://stackoverflow.com/a/35075028
        $scope.counter = Array;
        $scope.sections = [
            {
                name: "Overview",
                partial: "/wpw/views/character.overview.tab.html"
            },
            {
                name: "Summary Sheet",
                partial: "/wpw/views/character.summary.tab.html"
            },
            {
                name: "Basic Information",
                partial: "/wpw/views/character.basic.tab.html"
            },
            {
                name: "Ability Scores",
                partial: "/wpw/views/character.scores.tab.html"
            },
            /*{
                name: "Template",
                partial: "/wpw/views/character.template.tab.html"
            },*/
            {
                name: "Race",
                partial: "/wpw/views/character.race.tab.html"
            },
            {
                name: "Class",
                partial: "/wpw/views/character.classes.tab.html"
            },
            {
                name: "Skills",
                partial: "/wpw/views/character.skills.tab.html"
            },
            {
                name: "Feats",
                partial: "/wpw/views/character.feats.tab.html"
            },
            {
                name: "Languages",
                partial: "/wpw/views/character.languages.tab.html"
            },
            {
                name: "Advancement",
                partial: "/wpw/views/character.advancement.tab.html"
            },
            {
                name: "Gear",
                partial: "/wpw/views/character.gear.tab.html"
            },
            {
                name: "Equipment",
                partial: "/wpw/views/character.equipment.tab.html"
            }
        ];
        // Default is Overview
        $scope.userSelectedSection = $scope.sections[0];
        $scope.openSection = function (section) {
            var position;
            if (typeof section === 'string') {
                position = getArrayPosition($scope.sections, section, {
                    targetProperty: 'name'
                });
                if (section === -1) {
                    return false;
                }
                section = $scope.sections[position];
            }
            $rootScope.character.analyzeCharacterForCards();
            // Toggle the next section
            $scope.userSelectedSection = section;
            return true;
        };
        $scope.modals = [
            {
                name: 'Ability Scores',
                trigger: 'scores'
            },
            {
                name: 'Race',
                trigger: 'race'
            },
            {
                name: 'Classes',
                trigger: 'classes'
            }
        ];
        $scope.favoredStatus = {
            isopen: false
        };
        $scope.favoredOptions = {};
        $scope.debugging = function (args) {
            debugger;
        };
        // START OVERVIEW
        $scope.cardOptions = {
            showall: false
        };
        $scope.cardOptionsToggle = function (prop) {
            if (typeof $scope.cardOptions[prop] !== 'undefined') {
                $scope.cardOptions[prop] = !$scope.cardOptions[prop];
            }
        };
        // END OVERVIEW
        // START ALIGNMENT
        $scope.availableAlignments = [
            'Lawful Good', 'Neutral Good', 'Chaotic Good',
            'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
            'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
        ];
        $scope.selectAlignment = function (align) {
            $rootScope.character.alignment = align;
        };
        // END ALIGNMENT

        // START CLASSES
        // END CLASSES

        // START SKILLS
        $scope.options = {
            showClassSkillsOnly: false
        };
        $scope.shouldOptions = function (skill) {
            if ($scope.options.showClassSkillsOnly) {
                return $scope.isClassSkill(skill);
            }
            return true;
        };
        // END SKILLS

        $scope.availableModals = {
            "score": {
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: '/wpw/views/character.scores.modal.html',
                controller: 'abilityScoresModalController',
                thenFunc: function (args) {
                    $rootScope.character.applyScores(args.scores);
                    $rootScope.character.points = args.points;
                }
            },
            "race": {
                ariaLabelledBy: 'race-modal-title',
                ariaDescribedBy: 'race-modal-body',
                templateUrl: '/wpw/views/character.race.modal.html',
                controller: 'raceModalController',
                thenFunc: function (args) {
                    $rootScope.character.applyRace(args);
                }
            },
            "class": {
                ariaLabelledBy: 'classes-modal-title',
                ariaDescribedBy: 'classes-modal-body',
                templateUrl: '/wpw/views/character.classes.modal.html',
                controller: 'classesModalController',
                size: 'lg',
                thenFunc: function (args) {
                    $rootScope.character.applyClass(args);
                }
            },
            "input": {
                ariaLabelledBy: 'input-modal-title',
                ariaDescribedBy: 'input-modal-body',
                templateUrl: '/wpw/views/character.input.modal.html',
                controller: 'inputModalController',
                thenFunc: function (args) {
                    $rootScope.character.applySelections(args);
                }
            },
            "viewer": {
                ariaLabelledBy: 'veiwer-modal-title',
                ariaDescribedBy: 'veiwer-modal-body',
                templateUrl: '/wpw/views/character.viewer.modal.html',
                controller: 'viewerModalController',
                size: 'lg',
                thenFunc: function (args) {
                    var oldFeat, newFeat;
                    if (typeof args === 'undefined') {
                        return false;
                    }
                    oldFeat = args.oldFeat;
                    newFeat = args.newFeat;
                    // If this is not the first time the feat has been updated,
                    if (!args.firstUpdate &&
                        oldFeat.choices && oldFeat.choices > 0 && oldFeat.selections.length === oldFeat.choices) {
                        // remove the changes made by the formula
                        parseFormula(oldFeat.formula, $rootScope.character, oldFeat.selections, 'remove');
                    }
                    // If the feat
                    if (newFeat.choices && newFeat.choices > 0 && newFeat.selections.length === newFeat.choices) {
                        // apply feat changes
                        parseFormula(newFeat.formula, $rootScope.character, newFeat.selections);
                    }
                    return true;
                }
            }
        };
        $scope.openModal = function (modalArgs) {
            var modalInstance, parentElem, selectedModalType;
            if (typeof modalArgs === 'string') {
                modalArgs = {"version": modalArgs};
            }
            modalArgs = modalArgs || {"version": ''};
            parentElem = modalArgs.parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + modalArgs.parentSelector)) : undefined;
            selectedModalType = $scope.availableModals[modalArgs.version] || null;
            if (selectedModalType === null) {
                return false;
            }
            modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: selectedModalType.ariaLabelledBy,
                ariaDescribedBy: selectedModalType.ariaDescribedBy,
                templateUrl: selectedModalType.templateUrl,
                controller: selectedModalType.controller,
                resolve: selectedModalType.resolve,
                size: selectedModalType.size,
                appendTo: parentElem
            });

            modalInstance.result.then(function (args) {
                $scope.availableModals[modalArgs.version].thenFunc(args);
                $scope.checkPage();
            }, function (args) {
                console.info('Modal dismissed at: ' + new Date());
                if (typeof $scope.availableModals[modalArgs.version].dismissedFunc === 'function') {
                    $scope.availableModals[modalArgs.version].dismissedFunc(args);
                }
                $scope.checkPage();
            });

            return true;
        };
        $scope.selectQuality = function (quality) {
            var i;
            for (i = 0; i < $rootScope.character.race.qualities.length; ++i) {
                if (quality.name == $rootScope.character.race.qualities[i].name) {
                    $scope.selectedQuality = quality;
                    return true;
                }
            }
            return false;
        };
        $scope.selectCaldb = function (quality) {
            var i;
            for (i = 0; i < $rootScope.character.advancement.abilityScores.length; ++i) {
                if (quality.name == $rootScope.character.advancement.abilityScores[i].name) {
                    $scope.selectedCaldb = quality;
                    return true;
                }
            }
            return false;
        };

        // This works for all remove buttons
        $scope.removeSelections = function (objQuality) {
            // The want to try again, so we need to remove all the changes made by their selection
            parseFormula(objQuality.formula, $rootScope.character, objQuality.selections, 'remove');
            // Once it's removed, set to incomplete
            objQuality.status = 'incomplete';
            // Add it to the required input list again
            IssueHandler.addIssue(objQuality);
            // Check page for needed user input
            $scope.checkPage();
        };
        $scope.checkPage = function () {
            // if there is user selections required, open the modal
            if (IssueHandler.getLength() !== 0) {
                $scope.openModal({
                    version: 'input'
                });
            }
        };
        $scope.ignoreFunctions = function (obj) {
            return (typeof obj !== 'function');
        };
        $scope.isClassSkill = function (skill) {
            return getArrayPosition($rootScope.character.classSkills, skill.name, {
                    "ignoreCase": true,
                    "partial": true
                }) > -1;
        };

        // Class Tab
        $scope.getBab = function (currentClass, level) {
            var bab;
            bab = 0;
            switch (currentClass.bab) {
                case "full":
                    bab += level;
                    break;
                case "partial":
                    bab += level * 0.75;
                    break;
                case "half":
                    bab += level * 0.5;
                    break;
            }
            return math.floor(bab);
        };
        $scope.getSave = function (currentClass, name, level) {
            var save;
            save = 0;
            switch (currentClass.saves[name]) {
                case "good":
                    save += 2 + (level / 2);
                    break;
                case "bad":
                    save += level / 3;
                    break;
            }
            return math.floor(save);
        };
        $scope.executeFormulaWithShell = function (name, formula, level) {
            var shell, ret;
            shell = {
                classes: {}
            };
            shell.classes[name] = {
                "level": level
            };
            ret = math.eval(formula, shell);
            return ret;
        };
        $scope.selectFeature = function (currentClass, selectedFeature) {
            currentClass.selectedFeature = selectedFeature;
        };
        $scope.removeSelections = function (selectedFeature) {
            // They want to try again, so we need to remove all the changes made by their selection
            parseFormula(selectedFeature.formula, $rootScope.character, selectedFeature.selections, 'remove');
            // Once it's removed, set to incomplete
            selectedFeature.status = 'incomplete';
            // Add it to the required input list again
            IssueHandler.addIssue(selectedFeature);
            // Check page for needed user input
            $scope.checkPage();
        };
        $scope.modifyRank = function (skill, command, char) {
            if (command === 'increase') {
                skill.ranks += 1;
            } else if (command === 'decrease' && skill.ranks > 0) {
                skill.ranks -= 1;
            } else if (command === 'max' && skill.ranks < char.getMaxRanksPerSkill()) {
                skill.ranks = char.getMaxRanksPerSkill();
            } else if (command === 'zero') {
                skill.ranks = 0;
            }
        };

        // START FEATS
        $scope.displayedFeats = [];
        $scope.filteredFeats = [];
        $scope.totalFeats = 0;
        $scope.totalFiltered = 0;
        $scope.itemsPerPage = 25;
        $scope.currentPage = 1;
        $scope.pagerButtonsToShow = 5;
        $scope.featSearchModel = {
            "name": ''
        };
        $scope.getFeats = function () {
            PathfinderService.getData('feats').then(function (data) {
                $scope.displayedFeats = data;
                $scope.totalFeats = $scope.displayedFeats.length;
                $scope.updateFeatSearch();
            }, function (error) {
                // promise rejected
                console.log('[characterController] getFeats - Feats could not be retrieved.', error);
            });
        };
        $scope.updateFeatSearch = function () {
            $scope.filteredFeats = filterFilter($scope.displayedFeats, {name: $scope.featSearchModel.name});
            $scope.totalFiltered = $scope.filteredFeats.length;
        };
        $scope.viewFeat = function (feat, fromChar) {
            if (typeof fromChar === 'undefined') {
                fromChar = false;
            }
            // Move feat to the viewer,
            Viewer.setItem(feat, 'Feat', fromChar);
            // Display the details in a modal window
            $scope.openModal("viewer");
        };
        $scope.selectFeat = function (feat) {
            // Add the feat to the character
            $rootScope.character.feats.add(feat);
        };
        $scope.removeItem = function (position) {
            // remove the feat from the character
            $rootScope.character.feats.remove(position);
        };
        // END FEATS

        // START LANGUAGES
        $scope.displayedLanguages = [];
        $scope.filteredLanguages = [];
        $scope.totalLanguages = 0;
        $scope.totalLanguagesFiltered = 0;
        $scope.languageSearchModel = {
            "name": ''
        };
        $scope.getLanguages = function () {
            PathfinderService.getData('languages').then(function (data) {
                $scope.displayedLanguages = data;
                $scope.totalLanguages = $scope.displayedLanguages.length;
                $scope.updateLanguageSearch();
            }, function (error) {
                // promise rejected
                console.log('[characterController] getLanguages - Languages could not be retrieved.', error);
            });
        };
        $scope.updateLanguageSearch = function () {
            $scope.filteredLanguages = filterFilter($scope.displayedLanguages, {name: $scope.languageSearchModel.name});
            $scope.totalLanguagesFiltered = $scope.filteredLanguages.length;
        };
        $scope.viewLanguage = function (language, fromChar) {
            if (typeof fromChar === 'undefined') {
                fromChar = false;
            }
            // Move language to the viewer,
            Viewer.setItem(language, 'Language', fromChar);
            // Display the details in a modal window
            $scope.openModal("viewer");
        };
        $scope.selectLanguage = function (feat) {
            // Add the feat to the character
            $rootScope.character.languages.add(feat);
        };
        $scope.removeLanguage = function (position) {
            // remove the feat from the character
            $rootScope.character.languages.remove(position);
        };
        // END LANGUAGES

        // START EQUIPMENT
        $scope.totalLanguages = 0;
        $scope.totalLanguagesFiltered = 0;
        $scope.languageSearchModel = {
            "name": ''
        };
        $scope.equipment = {
            all: [],
            filtered: [],
            totalCount: 0,
            totalFiltered: 0,
            searchModel: {
                "name": ''
            },
            itemsPerPage: 13,
            currentPage: {
                weapon: 1,
                armor: 1
            },
            pagerButtonsToShow: 5,
            currentTab: 'weapon'

        };
        $scope.getEquipment = function () {
            PathfinderService.getData('equipment').then(function (data) {
                $scope.equipment.all = data;
                $scope.equipment.totalCount = $scope.equipment.all.length;
                $scope.updateEquipmentSearch();
            }, function (error) {
                // promise rejected
                console.log('[characterController] getEquipment - Equipment could not be retrieved.', error);
            });
        };
        $scope.updateEquipmentSearch = function () {
            $scope.equipment.filtered = filterFilter($scope.equipment.all,
                {name: $scope.equipment.searchModel.name, type: $scope.equipment.currentTab});
            $scope.equipment.totalFiltered = $scope.equipment.filtered.length;
        };
        $scope.updateCurrentTab = function (newTab) {
            $scope.equipment.currentTab = newTab;
            $scope.updateEquipmentSearch();
        };
        $scope.addItem = function (item) {
            $rootScope.character.equipment.add(item);
        };
        $scope.removeItem = function (item) {
            $rootScope.character.equipment.remove(item);
        };
        $scope.equipItem = function (item) {
            if (!PathfinderService.canEquipItem(item)) {
                return false;
            }
            $rootScope.character.equipment.equip(item);
            return true;
        };
        $scope.unequipItem = function (item) {
            if (!PathfinderService.canEquipItem(item)) {
                return false;
            }
            $rootScope.character.equipment.unequip(item);
            return true;
        };
        // END EQUIPMENT
    }
]);
angular.module('character').controller('abilityScoresModalController', function ($scope, $uibModalInstance) {
    // Provide all the point buy content
    var valueToPointsMap;
    valueToPointsMap = {
        "7": -4,
        "8": -2,
        "9": -1,
        "10": 0,
        "11": 1,
        "12": 2,
        "13": 3,
        "14": 5,
        "15": 7,
        "16": 10,
        "17": 13,
        "18": 17
    };
    function updatePoints() {
        var each, currentScoreValue, points;
        points = 0;
        for (each in $scope.scores) {
            currentScoreValue = $scope.scores[each];
            points += valueToPointsMap[currentScoreValue];
        }
        $scope.points = points;
    }

    //We default this behavior, because most people are going to use point buy
    $scope.updatePoints = updatePoints;
    $scope.points = 0;
    $scope.scores = {
        "strength": "10",
        "dexterity": "10",
        "constitution": "10",
        "intelligence": "10",
        "wisdom": "10",
        "charisma": "10"
    };
    updatePoints();

    $scope.ok = function () {
        $uibModalInstance.close({
            "scores": $scope.scores,
            "points": $scope.points
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
angular.module('character').controller('raceModalController', function ($scope, $uibModalInstance, PathfinderService) {
    // Get the defaults set up
    $scope.selectedRace = null;
    $scope.json = {
        races: null,
        qualities: null
    };
    PathfinderService.getData('races')
        .then(function (data) {
            $scope.json.races = data;
        }, function (error) {
            // promise rejected
            console.log('[raceModalController] Races could not be retrieved.', error);
        });
    PathfinderService.getData('qualities')
        .then(function (data) {
            $scope.json.qualities = data;
        }, function (error) {
            // promise rejected
            console.log('[raceModalController] Qualities could not be retrieved.', error);
        });
    $scope.chosenQualities = [];
    $scope.selectedQuality = null;
    $scope.selectedAlternativeQuality = null;

    $scope.selectRace = function (selection) {
        var i;
        $scope.selectedRace = selection;
        // Clear any content being displayed
        $scope.selectedQuality = null;
        $scope.selectedAlternativeQuality = null;
        // Save the qualities
        $scope.chosenQualities = [];
        for (i = 0; i < $scope.json.races[$scope.selectedRace].qualities.length; ++i) {
            $scope.chosenQualities.push($scope.json.races[$scope.selectedRace].qualities[i]);
        }
    };
    $scope.isChosenQuality = function (quality) {
        var i;
        for (i = 0; i < $scope.chosenQualities.length; ++i) {
            if (quality == $scope.chosenQualities[i]) {
                return true;
            }
        }
        return false;
    };
    $scope.ok = function () {
        var quals, i, qualityDetails;
        quals = [];
        // If no race is selected, we don't close the window
        if ($scope.selectedRace === null) {
            return false;
        }
        for (i = 0; i < $scope.chosenQualities.length; ++i) {
            qualityDetails = getQuality($scope.chosenQualities[i]);
            // If the quality couldn't be found, don't add it to the array of qualities
            if (qualityDetails === null) {
                continue;
            }
            //Search in default first
            quals.push(qualityDetails);
        }
        $uibModalInstance.close({
            "name": $scope.json.races[$scope.selectedRace].name,
            "qualities": quals
        });
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.qualitySelected = function (quality, type) {
        var i;

        for (i = 0; i < $scope.json.qualities.length; ++i) {
            if (quality == $scope.json.qualities[i].name) {
                if (type === 'quality') {
                    $scope.selectedQuality = i;
                } else if (type === 'alt') {
                    $scope.selectedAlternativeQuality = i;
                }
                return true;
            }
        }
        return false;
    };


    function getQuality(name) {
        var i;
        for (i = 0; i < $scope.json.qualities.length; ++i) {
            if (name === $scope.json.qualities[i].name) {
                return $scope.json.qualities[i];
            }
        }
        console.log('[raceModalController] getQuality - Quality named "' + name + '" not found.');
        return null;
    }

    function findQual(current) {
        var j;
        for (j = 0; j < $scope.chosenQualities.length; ++j) {
            if (current.toLowerCase() == $scope.chosenQualities[j].toLowerCase()) {
                return true;
            }
        }
        console.log('[raceModalController] findQual - Quality to replace not found in list.');
        return false;
    }

    function addQual(name) {
        if (typeof name !== 'string') {
            console.log('[raceModalController] addQual - Quality to add was not a string.');
            return false;
        }
        $scope.chosenQualities.push(name);
        return true;
    }

    function removeQual(current) {
        var j;
        for (j = 0; j < $scope.chosenQualities.length; ++j) {
            if (current.toLowerCase() == $scope.chosenQualities[j].toLowerCase()) {
                $scope.chosenQualities.splice(j, 1);
                return true;
            }
        }
        console.log('[raceModalController] removeQual - Quality to remove not found in list.');
        return false;
    }

    $scope.addQuality = function (quality) {
        var i;
        if (typeof quality !== 'object') {
            return false;
        }

        // Confirm the qualities we need to remove exist
        for (i = 0; i < quality.replaces.length; ++i) {
            if (findQual(quality.replaces[i]) === false) {
                return false;
            }
        }
        // Remove the qualities now that we know they all exist
        for (i = 0; i < quality.replaces.length; ++i) {
            if (removeQual(quality.replaces[i]) === false) {
                return false;
            }
        }
        addQual(quality.name);
    };

    $scope.removeQuality = function (quality) {
        var i;
        if (typeof quality !== 'object') {
            return false;
        }
        // Remove the added quality
        if (removeQual(quality.name) === false) {
            return false;
        }
        // Add the qualities it replaced
        for (i = 0; i < quality.replaces.length; ++i) {
            if (addQual(quality.replaces[i]) === false) {
                return false;
            }
        }
        return true;
    }
});
angular.module('character').controller('classesModalController', function ($rootScope, $scope, $uibModalInstance, PathfinderService, IssueHandler) {
    // Get the defaults set up
    $scope.selectedClass = null;
    $scope.json = {
        "classes": null,
        "features": null
    };
    PathfinderService.getData('classes')
        .then(function (data) {
            $scope.json.classes = data;
        }, function (error) {
            // promise rejected
            console.log('[raceModalController] Races could not be retrieved.', error);
        });
    PathfinderService.getData('features')
        .then(function (data) {
            $scope.json.features = data;
        }, function (error) {
            // promise rejected
            console.log('[raceModalController] Qualities could not be retrieved.', error);
        });
    $scope.spellFeaturePosition = -1;
    $scope.selectedFeature = null;
    // Work around for counting up to a number in ng-repeat in AngularJS
    // SEE: http://stackoverflow.com/a/35075028
    $scope.counter = Array;

    $scope.getFeatureByName = getFeatureByName;
    $scope.characterMeetsPrereqs = function (position) {
        var currentClass, each;
        currentClass = $scope.json.classes[position];
        if (typeof currentClass.prereqs !== 'undefined') {
            //TODO: Update to handle all variations that may be required.... not sure if possible, but it works for the paladin right now
            for (each in currentClass.prereqs) {
                if ($rootScope.character[each] === currentClass.prereqs[each]) {
                    return true;
                }
            }
        }
        return false;
    };
    $scope.doesClassHaveSpells = function () {
        var found;
        found = getArrayPosition($scope.json.classes[$scope.selectedClass].features, 'Spells (', {
            "ignoreCase": true,
            "partial": true
        });
        if (found) {
            $scope.spellFeatureDetails = getFeatureByName($scope.json.classes[$scope.selectedClass].features[found]);
        }
        $scope.spellFeaturePosition = found;
    };

    $scope.selectClass = function (selection) {
        $scope.selectedClass = selection;
        $scope.doesClassHaveSpells();
    };
    $scope.selectFeature = function (feature) {
        $scope.selectedFeature = feature;
    };
    $scope.getBab = function (level) {
        var currentClass, bab;
        bab = 0;
        currentClass = $scope.json.classes[$scope.selectedClass];
        switch (currentClass.bab) {
            case "full":
                bab += level;
                break;
            case "partial":
                bab += level * 0.75;
                break;
            case "half":
                bab += level * 0.5;
                break;
        }
        return math.floor(bab);
    };
    $scope.getSave = function (name, level) {
        var currentClass, save;
        save = 0;
        currentClass = $scope.json.classes[$scope.selectedClass];
        switch (currentClass.saves[name]) {
            case "good":
                save += 2 + (level / 2);
                break;
            case "bad":
                save += level / 3;
                break;
        }
        return math.floor(save);
    };
    $scope.getFeatureNamesForLevel = function (level) {
        var i, arrFeatures, currentFeatureName, currentFeature;
        arrFeatures = [];
        for (i = 0; i < $scope.json.classes[$scope.selectedClass].features.length; ++i) {
            currentFeatureName = $scope.json.classes[$scope.selectedClass].features[i];
            currentFeature = getFeatureByName(currentFeatureName);
            if (currentFeature && currentFeature.level === level) {
                arrFeatures.push(currentFeature);
            }
        }
        return arrFeatures;
    };
    $scope.executeFormulaWithShell = function (formula, level) {
        var shell, ret;
        shell = {
            classes: {}
        };
        shell.classes[$scope.json.classes[$scope.selectedClass].name.toLowerCase()] = {
            "level": level
        };
        ret = math.eval(formula, shell);
        return ret;
    };

    function getFeatureByName(name) {
        var i;
        for (i = 0; i < $scope.json.features.length; ++i) {
            if (name.toLowerCase() === $scope.json.features[i].name.toLowerCase()) {
                return $scope.json.features[i];
            }
        }
        console.log('[classesModalController] getFeatures - Feature named "' + name + '" not found.');
        return null;
    }

    $scope.ok = function (level) {
        var features, i, currentFeatureName, currentClass, charClassObj, currentFeature;
        features = [];
        // If no class is selected, we don't close the window
        if ($scope.selectedClass === null) {
            return false;
        }
        currentClass = $scope.json.classes[$scope.selectedClass];
        charClassObj = jQuery.extend(true, {}, currentClass);
        // Go through the features and only bring the level appropriate
        for (i = 0; i < currentClass.features.length; ++i) {
            currentFeatureName = currentClass.features[i];
            currentFeature = getFeatureByName(currentFeatureName);
            if (currentFeature === null || typeof currentFeature !== 'object') {
                console.log('[classesModalController] ok - Feature named "' + currentFeatureName + '" could not be added to feature array.');
                continue;
            }

            // If the feature is higher level, ignore it
            if (currentFeature.level > level) {
                continue;
            }
            features.push(currentFeature);
        }
        charClassObj.features = features;
        charClassObj.level = level;

        $uibModalInstance.close(charClassObj);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
angular.module('character').controller('inputModalController', function ($scope, $uibModalInstance, IssueHandler) {
    $scope.resolved = [];
    $scope.issue = IssueHandler.getNext();

    $scope.updateSelection = function (selection) {
        var i, currentSelection;
        // If it's already been added to this list, they are trying to remove it
        for (i = 0; i < $scope.issue.selections.length; ++i) {
            currentSelection = $scope.issue.selections[i];
            if (currentSelection === $scope.issue.options[selection]) {
                $scope.issue.selections.splice(i, 1);
                return false;
            }
        }
        // Otherwise add it.
        $scope.issue.selections.push($scope.issue.options[selection]);
        // If there are too many, remove the first option until the selections match the choices
        while ($scope.issue.selections.length > $scope.issue.choices) {
            $scope.issue.selections.splice(0, 1);
        }
        return true;
    };

    $scope.isSelectedOption = function (option) {
        var i;
        for (i = 0; i < $scope.issue.selections.length; ++i) {
            if (option == $scope.issue.selections[i]) {
                return true;
            }
        }
        return false;
    };
    $scope.ok = function () {
        var temp;
        // If the choices are not a number, try to convert it to one
        if (typeof $scope.issue.choices !== 'number') {
            temp = parseInt($scope.issue.choices);
            console.log('[inputModalController] ok - The value of "choices" for this issue is not a number...');
            if (!isNaN(temp)) {
                console.log('[inputModalController] ok - ... However, we were capable of converting it into a number.');
                $scope.issue.choices = temp;
            }
        }
        if ($scope.issue.selections.length !== $scope.issue.choices) {
            //TODO: Should probably let them know they have to pick one...
            return false;
        }
        // Mark the current one complete
        $scope.issue.status = 'complete';
        // Save the current one
        $scope.resolved.push($scope.issue);
        // Check if there are more
        if (IssueHandler.getLength() > 0) {
            // If there are, get the next one, and let them resolve it
            $scope.issue = IssueHandler.getNext();
            return false;
        }
        // If we are done, close the modal and pass back the updated info
        $uibModalInstance.close($scope.resolved);
        return true;
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
angular.module('character').controller('viewerModalController', function ($rootScope, $scope, $uibModalInstance, Viewer, PathfinderService) {
    $scope.item = Viewer.getItem();
    if (typeof $scope.item.options === 'string') {
        $scope.item.options = PathfinderService.parseOptions($scope.item.options);
    }
    // Create a copy of the item to act as the older version so the formula can be removed later.
    $scope.olditem = jQuery.extend(true, {}, $scope.item);
    $scope.fromCharacter = Viewer.isFromCharacter();
    $scope.modalType = Viewer.getModalType();
    $scope.firstUpdate = ($scope.item.choices && $scope.item.choices > 0 && $scope.item.selections.length === 0);

    $scope.updateSelection = function (selection) {
        var i, currentSelection;
        // If it's already been added to this list, they are trying to remove it
        for (i = 0; i < $scope.item.selections.length; ++i) {
            currentSelection = $scope.item.selections[i];
            if (currentSelection === $scope.item.options[selection]) {
                $scope.item.selections.splice(i, 1);
                return false;
            }
        }
        // Otherwise add it.
        $scope.item.selections.push($scope.item.options[selection]);
        // If there are too many, remove the first option until the selections match the choices
        while ($scope.item.selections.length > $scope.item.choices) {
            $scope.item.selections.splice(0, 1);
        }
        return true;
    };

    $scope.isSelectedOption = function (option) {
        var i;
        for (i = 0; i < $scope.item.selections.length; ++i) {
            if (option == $scope.item.selections[i]) {
                return true;
            }
        }
        return false;
    };
    $scope.resetItem = function () {
        // If choices exist,
        if ($scope.item.choices && $scope.item.choices > 0) {
            // clear them.
            $scope.item.selections = [];
        }
        // Set the status back to incomplete
        $scope.item.status = 'incomplete';
    };
    $scope.addItemToCharacter = function (item) {
        var temp, newItem, strPropName;
        // If the item is not from the character, we cannot remove it
        if ($scope.fromCharacter === true) {
            return false;
        }
        // If choices are required, review them
        if (item.choices && item.choices > 0) {
            // If the choices are not a number, try to convert it to one
            if (typeof $scope.item.choices !== 'number') {
                temp = parseInt($scope.item.choices);
                console.log('[viewerModalController] addItemToCharacter - The value of "choices" for this issue is not a number...');
                if (!isNaN(temp)) {
                    console.log('[viewerModalController] addItemToCharacter - ... However, we were capable of converting it into a number.');
                    $scope.item.choices = temp;
                }
            }
            if ($scope.item.selections.length !== $scope.item.choices) {
                //TODO: Should probably let them know they have to pick one...
                return false;
            }
            // Mark the current one complete
            $scope.item.status = 'complete';
        }
        newItem = jQuery.extend(true, {}, item);
        $scope.resetItem();
        // Build the property name for this new item to be added to
        strPropName = $scope.modalType.toLowerCase() + 's';
        // If the property exists,
        if (typeof $rootScope.character[strPropName] !== 'undefined') {
            // add the item.
            $rootScope.character[strPropName].add(newItem);
        }
        $uibModalInstance.close();
        return true;
    };
    $scope.removeItemFromCharacter = function (item) {
        var strPropName;
        // If the item is not from the character, we cannot remove it
        if ($scope.fromCharacter === false) {
            return false;
        }

        // Build the property name for this new item to be removed from
        strPropName = $scope.modalType.toLowerCase() + 's';
        // If the property exists,
        if (typeof $rootScope.character[strPropName] !== 'undefined') {
            // remove the item.
            $rootScope.character[strPropName].add(item);
        }
        $uibModalInstance.close();
    };
    $scope.saveChanges = function (item) {
        var temp;
        // If the item is not from the character, we cannot remove it
        if ($scope.fromCharacter === false) {
            return false;
        }
        // If choices are required, review them
        if (item.choices && item.choices > 0) {
            // If the choices are not a number, try to convert it to one
            if (typeof $scope.item.choices !== 'number') {
                temp = parseInt($scope.item.choices);
                console.log('[viewerModalController] saveChanges - The value of "choices" for this issue is not a number...');
                if (!isNaN(temp)) {
                    console.log('[viewerModalController] saveChanges - ... However, we were capable of converting it into a number.');
                    $scope.item.choices = temp;
                }
            }
            if ($scope.item.selections.length !== $scope.item.choices) {
                //TODO: Should probably let them know they have to pick one...
                return false;
            }
            // Mark the current one complete
            $scope.item.status = 'complete';
        }

        $uibModalInstance.close({
            "oldItem": $scope.oldItem,
            "newItem": item,
            "firstUpdate": $scope.firstUpdate
        });
    };
    $scope.closeViewer = function () {
        // Do not save changes when the close button is clicked
        $scope.resetItem();
        $uibModalInstance.dismiss('cancel');
    };
});