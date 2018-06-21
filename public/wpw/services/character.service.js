// Services
/**
 * Creates an object that maintains an array of objects with varying types that can be added, removed, and totaled.
 */
angular.module('character').factory('TypedArrayValue', function ($rootScope) {
    return function () {
        this.values = [];
        this.value = getTypedArrayTotal;
        this.add = addValue;
        this.remove = removeValue;
        this.getTypedArrayTotal = getTypedArrayTotal;

        /**
         * Adds a value to the value array.
         * @alias add
         * @example
         * // Basic removal
         * var value = {
             *     "type": "racial",
             *     "value": 2
             * }
         * character.scores.charisma.add(value);
         * @param {object} newValue - The object containing the type and value to add.
         * @returns {boolean} True if successful, otherwise false.
         */
        function addValue(newValue) {
            if (typeof newValue !== 'object'
                || (!newValue.hasOwnProperty("type") && !newValue.hasOwnProperty("value"))) {
                console.log('[TypedArrayValue] addValue - New value added must be an object with the properties "type" and "value" defined.');
                return false;
            }
            var temp;
            // Harvest the only properties I'm interested in from the object.
            temp = {
                "type": newValue.type,
                "value": newValue.value
            };
            this.values.push(temp);
            return true;
        }

        /**
         * Removes a value from the value array.
         * @alias remove
         * @example
         * // Basic removal
         * var value = {
             *     "type": "enhancement",
             *     "value": 4
             * }
         * character.saves.will.remove(value);
         * @param {object} valueToRemove - The object containing the type and value to remove.
         * @returns {boolean} True if successful, otherwise false.
         */
        function removeValue(valueToRemove) {
            var i, currentValue;
            // If we are removing all the values, just delete current content
            if (valueToRemove === 'all') {
                this.values = [];
                return true;
            }
            if (typeof valueToRemove !== 'object'
                || !valueToRemove.hasOwnProperty("type")) {
                console.log('[CalculatedValue] removeValue - The value to be removed must be an object with the property "type" defined to get a match.');
                return false;
            }
            // Loop through the values and try to find a match to remove
            for (i = 0; i < this.values.length; ++i) {
                currentValue = this.values[i];
                // If we have a type match,
                if (currentValue.type === valueToRemove.type) {
                    // and there is no value to match,
                    if (typeof valueToRemove.value !== 'number') {
                        // Remove all the values of that type
                        this.values.splice(i, 1);
                        continue;
                    }

                    // if there is a value to match, make sure it matches
                    if (currentValue.value === valueToRemove.value) {
                        // then remove the value
                        this.values.splice(i, 1);
                    }
                }
            }
            return true;
        }

        /**
         * Calculates the total of the given type for this value.
         * @param {string} [requestedType=all] The requested type.
         * @returns {number} The value of the type given or 0 if none found.
         */
        function getTypedArrayTotal(requestedType) {
            var total, i, type;
            total = 0;
            type = 'all';
            if (typeof requestedType === 'string') {
                type = requestedType;
            }

            // Add up all the different type values to get the total
            for (i = 0; i < this.values.length; ++i) {
                // If the value is not a number,
                if (typeof this.values[i].value !== 'number') {
                    //If the value is a string,
                    if (typeof this.values[i].value === 'string') {
                        // try to run it as a formula with character as the reference
                        total += math.eval(this.values[i].value, $rootScope.character);
                    }
                    continue;
                }
                // If the value type is not the requested type, ignore it
                if (type !== 'all' && this.values[i].type !== type) {
                    continue;
                }
                //TODO: Use only the highest of some bonuses like circumstantial or enhancement
                total += this.values[i].value;
            }
            return total;
        }
    };
});
/**
 * Creates an object that maintains an array of objects with varying types that can be added, removed, and totaled along
 * with an associated ability score modifier bonus.
 */
angular.module('character').factory('AbilityTypedArrayValue', ['TypedArrayValue', function (TypedArrayValue) {
    return function (abilityScore) {
        TypedArrayValue.call(this);

        this.abilityScore = abilityScore;
        this.value = AbilityTypedArrayValueTotal;
        // Preserve the totaling function even if 'this.value' is overwritten
        this.AbilityTypedArrayValueTotal = AbilityTypedArrayValueTotal;

        function AbilityTypedArrayValueTotal(requestedType) {
            var total;
            total = 0;
            if (requestedType === 'modifier') {
                return this.abilityScore.modifier();
            }

            total += this.getTypedArrayTotal(requestedType);

            // Add the modifier for the ability score to the total
            total += this.abilityScore.modifier();

            return total;
        }
    };
}]);
angular.module('character').factory('AbilityScore', ['TypedArrayValue', function (TypedArrayValue) {
    return function (abilityName) {
        TypedArrayValue.call(this);

        this.name = abilityName || '';
        this.modifier = getModifier;
        /**
         * Calculates the modifier for the given ability score.
         * NOTE: This requires math.js to be defined.
         * @requires math
         * @returns {*|Complex|number} The modifier value.
         */
        function getModifier() {
            return math.floor(( this.value() - 10 ) / 2);
        }
    };
}]);
angular.module('character').factory('Skill', ['AbilityTypedArrayValue', function (AbilityTypedArrayValue) {
    return function (skill, abilityScore) {
        AbilityTypedArrayValue.call(this, abilityScore);

        if (typeof skill !== 'object') {
            skill = {};
        }

        // Variables
        this.ranks = 0;
        this.untrained = skill.untrained || false;
        this.classSkill = skill["class skill"] || false;
        this.armorPenalty = skill["armorPenalty"] || false;
        this.value = skillTotal;
        // Preserve the totaling function even if 'this.value' is overwritten
        this.skillTotal = skillTotal;

        //Functions
        /**
         * Calculates the total of the given skill.
         * @requires character
         * @param {string} [requestedType=all] The requested type.
         * @returns {number} The value of the type given or 0 if none found.
         */
        function skillTotal(requestedType) {
            var total, type;
            total = 0;
            type = 'all';
            if (typeof requestedType === 'string') {
                type = requestedType;
            }

            // If we are only looking for ranks, there is only one
            if (type === 'ranks') {
                return this.ranks;
            }
            // If we just want the modifier, it's return
            if (type === 'modifier') {
                return this.AbilityTypedArrayValueTotal(type);
            }

            total += this.AbilityTypedArrayValueTotal(type);

            // Get the last of the data
            // Add the rank
            if (type === 'all') {
                total += this.ranks;
                // If it's a class skill and you have at least 1 rank, add 3 for class skill
                if (this.classSkill === true && this.ranks > 0) {
                    total += 3;
                }
                // If there is an armor check penalty, apply it
                if (this.armorPenalty === true) {
                    //TODO: Add armor penalty check
                }
            }
            return total;
        }
    };
}]);
angular.module('character').factory('Skills', ['Skill', function (Skill) {
    return function (skills, scores) {
        var i, currentSkill;

        //properties
        this.update = applyClassSkills;
        this.getAllRanks = getAllRanks;

        // If the passed in variable is an
        if (typeof skills !== 'object') {
            skills = {};
        }
        // Add all the basic skill information
        for (i = 0; i < skills.length; ++i) {
            currentSkill = skills[i];
            this[currentSkill.name.toLowerCase()] = new Skill(currentSkill, scores[currentSkill.ability]);
            if (this[currentSkill.name.toLowerCase()].armorPenalty) {
                this[currentSkill.name.toLowerCase()].add({
                    type: "armor check penalty",
                    value: "getArmorPenalty()"
                })
            }
        }

        function applyClassSkills(arrClassSkills) {
            var skillName, currentSkill;
            for (skillName in this) {
                currentSkill = this[skillName];
                if (typeof currentSkill !== 'object') {
                    continue;
                }
                currentSkill.classSkill = getArrayPosition(arrClassSkills, skillName, {
                        "ignoreCase": true,
                        "partial": true
                    }) > -1;
            }
        }

        function getAllRanks() {
            var each, total, currentSkill;
            total = 0;
            for (each in this) {
                currentSkill = this[each];
                total += currentSkill.ranks;
            }
            return total;
        }
    };
}]);
angular.module('character').factory('ActionCard', function () {
    return function (obj) {
        var self = this;
        var title, text, priority, section, formula;
        this.active = true;
        this.hide = false;

        this.getTitle = getTitle;
        this.setTitle = setTitle;

        this.getFormula = getFormula;
        this.setFormula = setFormula;

        this.getText = getText;
        this.setText = setText;

        this.getTag = getTag;

        this.getPriority = getPriority;
        this.setPriority = setPriority;

        this.getSection = getSection;
        this.setSection = setSection;

        this.getButtonText = getButtonText;

        function init(obj) {
            if (typeof obj !== 'object') {
                return false;
            }

            self.setTitle(obj.title);
            self.setText(obj.text);
            self.setPriority(obj.priority);
            self.setSection(obj.section);
            self.setFormula(obj.formula);
            return true;
        }

        init(obj);

        function getTitle() {
            return title;
        }

        function setTitle(newTitle) {
            if (typeof newTitle !== 'string') {
                return false;
            }
            title = newTitle;
            return true;
        }

        function getFormula() {
            return formula;
        }

        function setFormula(newFormula) {
            if (typeof newFormula !== 'string') {
                return false;
            }

            formula = newFormula;
            return true;
        }

        function getText() {
            return text;
        }

        function setText(newText) {
            if (typeof newText !== 'string') {
                return false;
            }
            if (newText.length > 100) {
                newText = newText.substring(0, 100);
            }
            text = newText;
            return true;
        }

        function getTag() {
            switch (priority) {
                case 5:
                    return "default";
                case 4:
                    return "success";
                case 3:
                    return "info";
                case 2:
                    return "warning";
                case 1:
                    return "danger";
                default:
                    return "default";
            }
        }

        function getPriority() {
            return priority;
        }

        function setPriority(newPriority) {
            if (typeof newPriority !== 'number') {
                return false;
            }
            // We only accept between 1 and 5.
            // If the given priority is less than 1, or more than 5,
            if (newPriority < 1 || newPriority > 5) {
                console.log('[ActionCard] setPriority - Priority must be between 1 and 5.');
                // Default it to the lowest priority.
                newPriority = 5;
                return true;
            }
            priority = newPriority;
            return true;
        }

        function getSection() {
            return section;
        }

        function setSection(newSection) {
            if (typeof newSection !== 'string') {
                return false;
            }
            section = newSection;
            return true;
        }

        function getButtonText() {
            var bText;
            switch (priority) {
                case 1:
                    bText = "Fix Now";
                    break;
                case 2:
                    bText = "Make Selection";
                    break;
                case 3:
                case 4:
                    // TODO: Add useful button text
                    bText = "BUTTON TEXT";
                    break;
                case 5:
                default:
                    bText = "Review";
                    break;
            }
            return bText;
        }
    };
});
angular.module('character').factory('Character', ['$resource', 'TypedArrayValue', 'AbilityTypedArrayValue', 'AbilityScore', 'Skills', 'IssueHandler', 'PathfinderService', 'ActionCard',
    function ($resource, TypedArrayValue, AbilityTypedArrayValue, AbilityScore, Skills, IssueHandler, PathfinderService, ActionCard) {
        return function () {
            var self = this;
            var initialized;
            initialized = false;
            // Basic information
            this.basics = {
                name: '',
                player: '',
                gender: '',
                height: '',
                weight: '',
                hair: '',
                eyes: '',
                skin: '',
                age: ''
            };
            // Action Cards for the Summary Page
            self.cards = [];
            // Default values required
            self.scores = {
                strength: new AbilityScore('strength'),
                dexterity: new AbilityScore('dexterity'),
                constitution: new AbilityScore('constitution'),
                intelligence: new AbilityScore('intelligence'),
                wisdom: new AbilityScore('wisdom'),
                charisma: new AbilityScore('charisma')
            };
            self.speed = {
                base: new TypedArrayValue(),
                climb: new TypedArrayValue(),
                burrow: new TypedArrayValue(),
                fly: new TypedArrayValue(),
                swim: new TypedArrayValue()
            };
            self.speed.fly.maneuverability = '';
            self.initiative = new AbilityTypedArrayValue(self.scores.dexterity);
            self.saves = {
                "fortitude": new AbilityTypedArrayValue(self.scores.constitution),
                "reflex": new AbilityTypedArrayValue(self.scores.dexterity),
                "will": new AbilityTypedArrayValue(self.scores.wisdom)
            };
            self.feats = {
                data: [],
                count: new TypedArrayValue(),
                add: addFeat,
                addSourcedFeat: addSourcedFeat,
                remove: removeFeat
            };
            self.languages = {
                data: [],
                count: new TypedArrayValue(),
                add: addLanguage,
                addSourcedFeat: addSourcedLanguage,
                remove: removeLanguage
            };
            self.classes = {};
            self.points = null;
            self.alignment = null;
            self.race = null;
            self.skills = null;
            self.classSkills = [];
            self.favoredClass = null;
            self.equipment = {
                slots: {
                    hand1: null,
                    hand2: null,
                    head: null,
                    headband: null,
                    eyes: null,
                    shoulders: null,
                    neck: null,
                    chest: null,
                    body: null,
                    armor: null,
                    belt: null,
                    wrists: null,
                    hands: null,
                    feet: null,
                    ring1: null,
                    ring2: null
                },
                inventory: [],
                add: addItem,
                addSourcedItem: addSourcedItem,
                equip: equipItem,
                unequip: unequipItem,
                remove: removeItem
            };
            self.bonusAttack = new TypedArrayValue();
            self.bonusDamage = new TypedArrayValue();

            // Initialization function
            self.init = init;
            // get functions
            self.getCharacterLevel = getCharacterLevel;
            self.getCurrentRanks = getCurrentRanks;
            self.getMaxTotalRanks = getMaxTotalRanks;
            self.getMaxRanksPerSkill = getMaxRanksPerSkill;
            self.getBab = getBab;
            self.getCmb = getCmb;
            self.getCmd = getCmd;
            self.getArmorClass = getArmorClass;
            self.getHitPoints = getHitPoints;
            self.getSave = getSave;
            self.getSpace = getSpace;
            self.getReach = getReach;
            self.getBonus = getBonus;
            self.getFavoredSelections = getFavoredSelections;
            self.getNumberOfSpells = getNumberOfSpells;
            self.collectClassesDetails = collectClassesDetails;
            self.collectSpelllikeDetails = collectSpelllikeDetails;
            self.calculateConcentration = calculateConcentration;
            self.getAttackBonus = getAttackBonus;
            // Has functions
            self.hasClassByName = hasClassByName;
            self.hasFeatByName = hasFeatByName;
            self.hasRace = hasRace;
            self.getArmorPenalty = getArmorPenalty;
            self.getShieldBonus = getShieldBonus;
            // bool checks
            self.canRemoveFeatByName = canRemoveFeatByName;
            // Favored Class Skill specific
            self.processFavoredOptions = processFavoredOptions;
            self.updateFavoredClass = updateFavoredClass;
            self.updateFavoredSelections = updateFavoredSelections;
            // apply user or db input
            self.applyScores = applyAbilityScores;
            self.applySkills = applySkills;
            self.applyRace = applyRaceChanges;
            self.applyClass = applyClassChanges;
            self.applySelections = applySelections;
            self.addItem = addItem;

            self.generateCharacterCards = generateCharacterCards;
            self.analyzeCharacterForCards = analyzeCharacterForCards;

            function init() {
                if (initialized) {
                    console.log('[Character] init - Character already initialized.');
                    return false;
                }
                // Get skills from the server. We'll need them.
                PathfinderService.getData('skills')
                    .then(function (data) {
                        self.applySkills(data);
                    }, function (error) {
                        // promise rejected
                        console.log('[Character] init - Skills could not be retrieved.', error);
                    });
                // Add the advancement feats,
                self.feats.count.add({
                    "type": "advancement",
                    "value": "larger(getCharacterLevel(), 0) + floor(getCharacterLevel() / 2)"
                });
                // and bonus languages.
                self.languages.count.add({
                    "type": "intelligence",
                    "value": "max(scores.intelligence.modifier(), 0)"
                });
                // Add possible languages from linguistics skill
                self.languages.count.add({
                    "type": "linguistics",
                    "value": "skills.linguistics.ranks"
                });
                // Set up the basic atk/damage typed array

                // ATTACKS
                // All attacks get base attack bonus
                self.bonusAttack.add({
                    type: "base attack bonus",
                    value: "getCharacterLevel()"
                });
                // Melee attacks get strength
                self.bonusAttack.add({
                    type: "dexterity",
                    value: "equipment.slots.hand1.isMelee()*scores.strength.modifier()"
                });
                // Ranged weapons get dexterity
                self.bonusAttack.add({
                    type: "dexterity",
                    value: "equipment.slots.hand1.isRanged()*scores.dexterity.modifier()"
                });
                // DAMAGE
                // Melee damage get strength
                self.bonusDamage.add({
                    type: "strength",
                    value: "equipment.slots.hand1.isMelee()*scores.strength.modifier()"
                });
                // Two-handed weapons get 0.5 times more strength
                self.bonusDamage.add({
                    type: "strength",
                    value: "floor(equipment.slots.hand1.isTwoHanded()*scores.strength.modifier()*0.5)"
                });
                //TODO: Add enchantment bonus to attack/damage
                // Setup the action cards
                self.generateCharacterCards();
                self.analyzeCharacterForCards();
                initialized = true;
                return true;
            }

            function addItem(item) {
                var i;
                // If there is no item, do nothing
                if (item === null || typeof item === 'undefined') {
                    return false;
                }
                // If the parameter is an array of items,
                if (isArray(item)) {
                    // add all of them.
                    for (i = 0; i < item.length; ++i) {
                        self.equipment.inventory.add(item[i]);
                    }
                    return false;
                }
                // If this is coming from a specific source, we need to process it as a sourced item
                if (typeof item === 'object' && item.source) {
                    return self.addSourcedItem(item);
                }

                // If we just have a the name of a item (just a string),
                if (typeof item === 'string') {
                    // get the full details of the item from the PathFinder service.
                    item = PathfinderService.getFromListByName('equipment', item);
                    // If the item is found by name,
                    if (item !== null && typeof item === 'object') {
                        // create a deep clone of the target item so we don't use the stored version
                        // Items can be selected more than once, so copies of the feats are required
                        item = jQuery.extend(true, {}, item);
                    }
                }

                // add default functions
                item.hasTag = item.hasTag || function (tag) {
                        var i;
                        for (i = 0; i < this.tags.length; ++i) {
                            if (this.tags[i] === tag) {
                                return true;
                            }
                        }
                        return false;
                    };
                item.isRanged = item.isRanged || function () {
                        return this.hasTag('ranged');
                    };
                item.isMelee = item.isMelee || function () {
                        return this.hasTag('melee');
                    };
                item.isTwoHanded = item.isTwoHanded || function () {
                        return this.slot === '2-hand';
                    };
                // add the new item
                self.equipment.inventory.push(item);
                // return success.
                return true;
            }

            function addSourcedItem(sourcedItem) {
                var newItem, targetItem;
                // If the sourced feat has no name, we cannot do anything
                if (typeof sourcedItem.name === 'undefined') {
                    console.log('[Character] addSourcedItem - Sourced item has no name, and cannot be added. Type: "' + sourcedItem.type + '" Source: "' + sourcedItem.source + '"');
                    return false;
                }
                // Get the named feat
                targetItem = PathfinderService.getFromListByName('feats', sourcedItem.name);
                if (targetItem === null) {
                    console.log('[Character] addSourcedItem - Sourced item named "' + sourcedItem.name + '" does not exist.');
                    return false;
                }
                newItem = jQuery.extend(true, {}, targetItem);

                // Add the type and source
                if (typeof sourcedItem.source !== 'undefined') {
                    newItem.source = sourcedItem.source;
                }
                self.equipment.inventory.push(newItem);
                return true;
            }

            function equipItem(itemToEquip) {
                var tempItem1, tempItem2, slotName;
                // If the item is not an object,
                if (typeof itemToEquip !== 'object') {
                    // do nothing.
                    console.log('[Character] equipItem - Item to equip was not an object.');
                    return false;
                }
                // If the item to remove doesn't have a name,
                if (typeof itemToEquip.name === 'undefined') {
                    // there is nothing we can do.
                    console.log('[Character] equipItem - The item given must have a name.');
                    return false;
                }
                // Get the slot name
                slotName = itemToEquip.slot;
                // However, if the item goes in one or both hands,
                if (itemToEquip.slot.indexOf('-hand') > -1) {
                    // If the character is wielding nothing, both hands are full, or the item is 2-handed,
                    // we assume the item will go in hand1.
                    slotName = 'hand1';
                    // If there is something in hand1, there is nothing in hand2, and the item is not for 2 hands
                    if (self.equipment.slots.hand1 !== null && self.equipment.slots.hand1.slot !== '2-hand'
                        && self.equipment.slots.hand2 === null && itemToEquip.slot !== '2-hand') {
                        // We put it in hand2
                        slotName = 'hand2';
                    }
                }
                // Get the item in the slot we are going to use.
                tempItem1 = self.equipment.slots[slotName];
                // If there is an item in the designated slot,
                if (tempItem1 !== null) {
                    // unequip the item.
                    self.equipment.unequip(tempItem1);
                }
                // if the item is a 2-handed weapon,
                if (itemToEquip.slot === '2-hand') {
                    // Get the item from hand2
                    tempItem2 = self.equipment.slots.hand2;
                    // If hand2 is not empty,
                    if (tempItem2 !== null) {
                        // unequip the item.
                        self.equipment.unequip(tempItem2);
                        // Empty the slot.
                        self.equipment.slots.hand2 = null;
                    }
                }

                // Remove the item from the character's inventory
                self.equipment.remove(itemToEquip, 'inventory');
                // Add the new item to the slot
                self.equipment.slots[slotName] = itemToEquip;

                // Apply changes by the formula if it exists
                if (typeof itemToEquip.forumla !== 'undefined') {
                    parseFormula(itemToEquip.formula, self, itemToEquip.selections);
                }
            }

            function unequipItem(item) {
                var tempItem1, slotName;
                // If the item is not an object,
                if (typeof item !== 'object') {
                    // do nothing.
                    console.log('[Character] unequipItem - Item to equip was not an object.');
                    return false;
                }
                // If the feat object to remove doesn't have a name,
                if (typeof item.name === 'undefined') {
                    // there is nothing we can do.
                    console.log('[Character] unequipItem - The item given must have a name.');
                    return false;
                }
                // Get the slot name
                slotName = item.slot;
                // If the item goes in the hand,
                if (item.slot.indexOf('-hand') > -1) {
                    // We check hand1 for the item
                    slotName = 'hand1';
                    // If there is an item in hand1, and the name of the item doesn't match the item we are unequiping,
                    if (self.equipment.slots[slotName] === null || self.equipment.slots[slotName].name !== item.name) {
                        // The item is in hand2.
                        slotName = 'hand2';
                    }
                }
                // Get the item in the slot
                tempItem1 = self.equipment.slots[slotName];
                // If the item doesn't exist, or the names do not match,
                if (tempItem1 === null || tempItem1.name !== item.name) {
                    // Something is wrong, fail.
                    return false;
                }
                // If the formula is defined,
                if (typeof tempItem1.formula !== 'undefined') {
                    // remove the changes made by the formula.
                    parseFormula(tempItem1.formula, self, tempItem1.selections, 'remove');
                }
                // Remove from slots
                self.equipment.slots[slotName] = null;
                // Add back to inventory
                self.equipment.inventory.push(item);
                return true;
            }

            function removeItem(itemToRemove, location) {
                var tempItem, i, currentItem, each;
                if (typeof location === 'undefined') {
                    location = 'all';
                }
                // If the item is not an object,
                if (typeof itemToRemove !== 'object') {
                    // do nothing.
                    console.log('[Character] removeItem - Item to remove was not an object.');
                    return false;
                }
                // If the feat object to remove doesn't have a name,
                if (typeof itemToRemove.name === 'undefined') {
                    // there is nothing we can do.
                    console.log('[Character] removeItem - The item given must have a name.');
                    return false;
                }

                tempItem = null;
                if (location === 'all' || location === 'slots') {
                    // Search for the items in slots first
                    for (each in self.equipment.slots) {
                        currentItem = self.equipment.slots[each];
                        // If this slot has no item,
                        if (currentItem === null) {
                            // skip this slot.
                            continue;
                        }
                        // If the sources do not match,
                        if (currentItem.source !== itemToRemove.source) {
                            // skip this item
                            continue;
                        }
                        // If the names match,
                        if (currentItem.name === itemToRemove.name) {
                            // set the temp item for post-processing
                            tempItem = currentItem;
                            // remove the item from the slot
                            self.equipment.slots[each] = null;
                            // end the loop.
                            break;
                        }
                    }
                }
                // If we did not find the item,
                if (tempItem === null && location === 'all' || location === 'inventory') {
                    // Try to remove the item from inventory
                    for (i = 0; i < self.equipment.inventory.length; ++i) {
                        currentItem = self.equipment.inventory[i];
                        // If the sources do not match,
                        if (currentItem.source !== itemToRemove.source) {
                            // skip this item.
                            continue;
                        }
                        // If the names match,
                        if (currentItem.name === itemToRemove.name) {
                            // set the temp item for post-processing
                            tempItem = currentItem;
                            // remove the item from the list
                            self.equipment.inventory.splice(i, 1);
                            // end the loop.
                            break;
                        }
                    }
                }

                // If we did not find the item in slots, it's not here,
                if (tempItem === null) {
                    // there is nothing left to do
                    console.log('[Character] removeItem - The item named"' + itemToRemove.name + '" could not be found.');
                    return false;
                }
                // remove any changes it made
                parseFormula(tempItem.formula, self, tempItem.selections, 'remove');
                return true;
            }

            function getArmorPenalty() {
                var penalty = 0;
                if (self.equipment.slots.armor !== null) {
                    penalty = self.equipment.slots.armor.armorPenalty || 0;
                }
                return penalty;
            }

            function getShieldBonus() {
                var value, item;
                value = null;
                item = self.equipment.slots.hand1;
                if (item !== null && item.hasTag('shield')) {
                    value = item.bonus || 0;
                }
                item = self.equipment.slots.hand2;
                if (item !== null && item.hasTag('shield')) {
                    value = item.bonus || 0;
                }
                return value;
            }

            function addFeat(feat) {
                var tempFeat, i;
                // If there is no feat, do nothing
                if (feat === null || typeof feat === 'undefined') {
                    return false;
                }
                // If the parameter is an array of feats,
                if (isArray(feat)) {
                    // add all of them.
                    for (i = 0; i < feat.length; ++i) {
                        self.feats.add(feat[i]);
                    }
                    return false;
                }
                // If this is coming from a specific source, we need to process it as a sourced feat
                if (typeof feat === 'object' && feat.source) {
                    // NOTE: this refers to the feats object in this function
                    return self.feats.addSourcedFeat(feat);
                }

                // If this feat is just a generic feat, and the character cannot have feats (normally caused by not having class levels)
                if (self.feats.count.value('advancement') === 0) {
                    // do nothing
                    return false;
                }
                // If we just have a the name of a feat (just a string),
                if (typeof feat === 'string') {
                    // get the full details of the feat from the PathFinder service.
                    feat = PathfinderService.getFromListByName('feats', feat);
                    // If the feat is found by name,
                    if (feat !== null && typeof feat === 'object') {
                        // create a deep clone of the target feat so we don't use the stored version
                        // Some feats can be selected more than once, so copies of the feats are required
                        feat = jQuery.extend(true, {}, feat);
                    }
                }

                // If there is no room for another feat,
                if (self.feats.data.length >= self.feats.count.value()) {
                    // remove the last added feat,
                    tempFeat = self.feats.data.pop();
                    // Remove any changes it made,
                    parseFormula(tempFeat.formula, self, tempFeat.selections, 'remove');
                }
                // add the new feat
                self.feats.data.push(feat);

                // If there is no status property, or the status is complete,
                if (typeof feat.status === 'undefined' || feat.status === 'complete') {
                    // apply feat changes
                    parseFormula(feat.formula, self, feat.selections);
                }
                // return success.
                return true;
            }

            function addSourcedFeat(sourcedFeat) {
                var newFeat, targetFeat;
                // If the sourced feat has no name, we cannot do anything
                if (typeof sourcedFeat.name === 'undefined') {
                    console.log('[Character] addSourcedFeat - Sourced feat has no name, and cannot be added. Type: "' + sourcedFeat.type + '" Source: "' + sourcedFeat.source + '"');
                    return false;
                }
                // Get the named feat
                targetFeat = PathfinderService.getFromListByName('feats', sourcedFeat.name);
                if (targetFeat === null) {
                    console.log('[Character] addSourcedFeat - Sourced feat named "' + sourcedFeat.name + '" does not exist.');
                    return false;
                }
                newFeat = jQuery.extend(true, {}, targetFeat);

                // Add the type and source
                if (typeof sourcedFeat.type !== 'undefined') {
                    newFeat.type = sourcedFeat.type;
                }
                if (typeof sourcedFeat.source !== 'undefined') {
                    newFeat.source = sourcedFeat.source;
                }
                self.feats.data.push(newFeat);
                self.feats.count.add({
                    "type": newFeat.type || newFeat.source,
                    "value": 1
                });
                //TODO: Maybe add to issue list, if it has options?
                return true;
            }

            function removeFeat(featToRemove) {
                var tempFeat, i, currentFeat, selectionsMatch, j;
                // If the character has no feats,
                if (self.feats.data.length == 0) {
                    // do nothing.
                    console.log('[Character] removeFeat - Character has no feats to remove.');
                    return false;
                }
                // If the feat is not an object,
                if (typeof featToRemove !== 'object') {
                    // do nothing.
                    console.log('[Character] removeFeat - Feat to remove was not an object.');
                    return false;
                }
                // If the feat object to remove doesn't have a name,
                if (typeof featToRemove.name === 'undefined') {
                    // there is nothing we can do.
                    console.log('[Character] removeFeat - The feat given must have a name.');
                    return false;
                }

                tempFeat = null;
                // Remove the feat from the data list
                for (i = 0; i < self.feats.data.length; ++i) {
                    currentFeat = self.feats.data[i];
                    // If the sources do not match,
                    if (currentFeat.source !== featToRemove.source) {
                        // skip this feat
                        continue;
                    }
                    // If the names match,
                    if (currentFeat.name === featToRemove.name) {
                        // If there are selections,
                        if (currentFeat.selections && featToRemove.selections) {
                            // If the length of selections do not match,
                            if (currentFeat.selections.length !== featToRemove.selections.length) {
                                // It's not this feat, continue checking
                                continue;
                            }
                            // loop through the selections,
                            selectionsMatch = true;
                            for (j = 0; j < currentFeat.selections.length; ++j) {
                                // If the selections do not match,
                                if (currentFeat.selections[j] !== featToRemove.selections[j]) {
                                    // set boolean
                                    selectionsMatch = false;
                                    // and break current loop
                                    break;
                                }
                            }
                            // If the selections match,
                            if (selectionsMatch) {
                                // set the temp feat for post-processing
                                tempFeat = currentFeat;
                                // remove the feat from the list
                                self.feats.data.splice(i, 1);
                                // end the loop
                                break;
                            }
                        } else {
                            // If there are no selections,
                            // set the temp feat for post-processing
                            tempFeat = currentFeat;
                            // remove the feat from the list
                            self.feats.data.splice(i, 1);
                            // end the loop
                            break;
                        }
                    }
                }
                // If we did not find the feat,
                if (tempFeat === null) {
                    // there is nothing left to do
                    console.log('[Character] removeItem - The feat named"' + featToRemove.name + '" could not be found.');
                    return false;
                }
                // remove any changes it made
                parseFormula(tempFeat.formula, self, tempFeat.selections, 'remove');

                return true;
            }

            function addLanguage(language) {
                var tempLanguage, i;
                // If there is no language, do nothing
                if (language === null || typeof language === 'undefined') {
                    return false;
                }
                // If the parameter is an array of languages,
                if (isArray(language)) {
                    // add all of them.
                    for (i = 0; i < language.length; ++i) {
                        self.languages.add(language[i]);
                    }
                    return false;
                }
                // If this is coming from a specific source, we need to process it as a sourced language
                if (typeof language === 'object' && language.source) {
                    // NOTE: this refers to the feats object in this function
                    return self.languages.addSourcedFeat(language);
                }

                // If this language is just from high intelligence, and the character cannot have any more languages,
                if (self.languages.count.value('intelligence') === 0) {
                    // do nothing
                    return false;
                }
                // If we just have a the name of a language (just a string),
                if (typeof language === 'string') {
                    // get the full details of the language from the PathFinder service.
                    language = PathfinderService.getFromListByName('languages', language);
                    // If the language is found by name,
                    if (language !== null && typeof language === 'object') {
                        // create a deep clone of the target language so we don't use the stored version
                        // Some feats can be selected more than once, so copies of the feats are required
                        language = jQuery.extend(true, {}, language);
                    }
                }

                // If there is no room for another language,
                if (self.languages.data.length >= self.languages.count.value()) {
                    // remove the last added language,
                    tempLanguage = self.languages.data.pop();
                    // If the language has a formula to apply,
                    if (typeof tempLanguage.formula !== 'undefined') {
                        // remove any changes it made
                        parseFormula(tempLanguage.formula, self, tempLanguage.selections, 'remove');
                    }
                }
                // add the new language
                self.languages.data.push(language);

                // If there is no status property, or the status is complete,
                if (typeof language.status === 'undefined' || language.status === 'complete') {
                    // If the language has a formula to apply,
                    if (typeof language.formula !== 'undefined') {
                        // apply language changes
                        parseFormula(language.formula, self, language.selections);
                    }
                }
                // return success.
                return true;
            }

            function addSourcedLanguage(sourcedLanguage) {
                var newLanguage, targetLanguage;
                // If the sourced feat has no name, we cannot do anything
                if (typeof sourcedLanguage.name === 'undefined') {
                    console.log('[Character] addSourcedLanguage - Sourced language has no name, and cannot be added. Type: "' + sourcedLanguage.type + '" Source: "' + sourcedLanguage.source + '"');
                    return false;
                }
                // Get the named language
                targetLanguage = PathfinderService.getFromListByName('languages', sourcedLanguage.name);
                if (targetLanguage === null) {
                    console.log('[Character] addSourcedLanguage - Sourced language named "' + sourcedLanguage.name + '" does not exist.');
                    return false;
                }
                newLanguage = jQuery.extend(true, {}, targetLanguage);

                // Add the type and source
                if (typeof sourcedLanguage.type !== 'undefined') {
                    newLanguage.type = sourcedLanguage.type;
                }
                if (typeof sourcedLanguage.source !== 'undefined') {
                    newLanguage.source = sourcedLanguage.source;
                }
                self.languages.data.push(newLanguage);
                self.languages.count.add({
                    "type": newLanguage.type || newLanguage.source,
                    "value": 1
                });
                //TODO: Maybe add to issue list, if it has options?
                return true;
            }

            function removeLanguage(langToRemove) {
                var tempLanguage, i, currentLanguage, selectionsMatch, j;
                // If the character has no languages,
                if (self.languages.data.length == 0) {
                    // do nothing.
                    console.log('[Character] removeLanguage - Character has no languages to remove.');
                    return false;
                }
                // If the feat is not an object,
                if (typeof langToRemove !== 'object') {
                    // do nothing.
                    console.log('[Character] removeLanguage - Language to remove was not an object.');
                    return false;
                }
                // If the feat object to remove doesn't have a name,
                if (typeof langToRemove.name === 'undefined') {
                    // there is nothing we can do.
                    console.log('[Character] removeLanguage - The language given must have a name.');
                    return false;
                }

                tempLanguage = null;
                // Remove the language from the data list
                for (i = 0; i < self.languages.data.length; ++i) {
                    currentLanguage = self.languages.data[i];
                    // If the sources do not match,
                    if (currentLanguage.source !== langToRemove.source) {
                        // skip this feat
                        continue;
                    }
                    // If the names match,
                    if (currentLanguage.name === langToRemove.name) {
                        // If there are selections,
                        if (currentLanguage.selections && langToRemove.selections) {
                            // If the length of selections do not match,
                            if (currentLanguage.selections.length !== langToRemove.selections.length) {
                                // It's not this feat, continue checking
                                continue;
                            }
                            // loop through the selections,
                            selectionsMatch = true;
                            for (j = 0; j < currentLanguage.selections.length; ++j) {
                                // If the selections do not match,
                                if (currentLanguage.selections[j] !== langToRemove.selections[j]) {
                                    // set boolean
                                    selectionsMatch = false;
                                    // and break current loop
                                    break;
                                }
                            }
                            // If the selections match,
                            if (selectionsMatch) {
                                // set the temp feat for post-processing
                                tempLanguage = currentLanguage;
                                // remove the feat from the list
                                self.languages.data.splice(i, 1);
                                // end the loop
                                break;
                            }
                        } else {
                            // If there are no selections,
                            // set the temp feat for post-processing
                            tempLanguage = currentLanguage;
                            // remove the feat from the list
                            self.languages.data.splice(i, 1);
                            // end the loop
                            break;
                        }
                    }
                }
                // If we did not find the language,
                if (tempLanguage === null) {
                    // there is nothing left to do
                    console.log('[Character] removeLanguage - The language named "' + langToRemove.name + '" could not be found.');
                    return false;
                }

                // remove any changes it made
                if (typeof tempLanguage.formula !== 'undefined') {
                    parseFormula(tempLanguage.formula, self, tempLanguage.selections, 'remove');
                }

                return true;
            }

            function hasFeatByName(featName) {
                return getArrayPosition(self.feats.data, featName, {
                        ignoreCase: true,
                        "targetProperty": "name"
                    }) > -1;
            }

            function canRemoveFeatByName(featName) {
                var position, targetFeat;
                position = getArrayPosition(self.feats.data, featName, {
                    ignoreCase: true,
                    "targetProperty": "name"
                });
                targetFeat = self.feats.data[position];
                return (typeof targetFeat.source === 'undefined');
            }

            /**
             * Calculates the effective character level.
             * @returns {number} The effective character level.
             */
            function getCharacterLevel() {
                var level, each, currentClass;
                level = 0;
                //TODO: include templates
                for (each in self.classes) {
                    currentClass = self.classes[each];
                    level += currentClass.level;
                }
                return level;
            }

            /**
             * Calculates the total number of ranks the character has from class levels.
             * @returns {number} The total number of skill ranks.
             */
            function getMaxTotalRanks() {
                var each, currentClass, maxRanks, ranksPerLevel, favoredSelections, currentSelection;
                maxRanks = 0;
                for (each in self.classes) {
                    currentClass = self.classes[each];
                    ranksPerLevel = currentClass.ranks + self.scores.intelligence.modifier();
                    // If the intelligence modifier reduces his skills down to less than 1, set it to 1
                    if (ranksPerLevel < 1) {
                        ranksPerLevel = 1;
                    }
                    maxRanks += ranksPerLevel * currentClass.level;
                }
                // Include points from favored class bonus
                favoredSelections = self.getFavoredSelections();
                for (each in favoredSelections) {
                    currentSelection = favoredSelections[each];
                    if (currentSelection.text === '1 Skill Point') {
                        maxRanks += 1;
                    }
                }
                return maxRanks;
            }

            /**
             * Calculates the maximum ranks for any skill.
             * @returns {number} The maximum ranks allowed for a skill.
             */
            function getMaxRanksPerSkill() {
                //TODO: Confirm this is the correct method
                return self.getCharacterLevel();
            }

            /**
             * Totals the number of ranks given across all available skills for the character.
             * @returns {number} - The current total ranks for the character.
             */
            function getCurrentRanks() {
                var each, totalRanks, currentSkill;
                totalRanks = 0;
                for (each in self.skills) {
                    currentSkill = self.skills[each];
                    // If it's a function, or some other variable, skip it.
                    if (typeof currentSkill.ranks === 'undefined') {
                        continue;
                    }
                    totalRanks += currentSkill.ranks;
                }
                return totalRanks;
            }

            function getBab() {
                var each, currentClass, bab;
                bab = 0;
                for (each in self.classes) {
                    currentClass = self.classes[each];
                    bab += PathfinderService.calculateBab(currentClass.bab, currentClass.level);
                }
                return bab;
            }

            function getCmb() {
                //TODO: Maybe add "miscellaneous modifiers?"
                return self.getBab() + self.scores.strength.modifier() + PathfinderService.getSpecialSizeModifier(self.size);
            }

            function getCmd() {
                //TODO: Maybe add "miscellaneous modifiers?"
                return 10 + self.getBab() + self.scores.strength.modifier() + self.scores.dexterity.modifier() + PathfinderService.getSpecialSizeModifier(self.size);
            }

            function getArmorClass(type) {
                var ac;
                ac = 0;
                if (type !== 'armor') {
                    ac += 10;
                }
                if (type !== 'flat-footed' && type !== 'armor') {
                    ac += self.scores.dexterity.modifier();
                }
                if (type !== 'touch') {
                    // Get the armor bonus from the armor
                    if (self.equipment.slots.armor && self.equipment.slots.armor.bonus) {
                        ac += self.equipment.slots.armor.bonus;
                    }
                }

                return ac;
            }

            function getHitPoints() {
                var hp, each, currentClass, currentSelection, favoredSelections;
                hp = 0;
                // Add class HP
                //TODO: Make this value not maxed.
                for (each in self.classes) {
                    currentClass = self.classes[each];
                    hp += currentClass.level * currentClass.hitDie;
                }
                // Add con bonus HP
                hp += self.scores.constitution.modifier() * self.getCharacterLevel();
                // Add hp from favored class
                favoredSelections = self.getFavoredSelections();
                for (each in favoredSelections) {
                    currentSelection = favoredSelections[each];
                    if (currentSelection.text === '1 Hit Point') {
                        hp += 1;
                    }
                }
                return hp;
            }

            function getSave(type) {
                var save, each, currentClass;
                save = 0;
                // Add the class save values
                for (each in self.classes) {
                    currentClass = self.classes[each];
                    save += PathfinderService.calculateSave(currentClass.saves[type], currentClass.level);
                }
                // Add values from the ability score, and other misc sources
                save += self.saves[type].value();
                return save;
            }

            function getSpace() {
                return PathfinderService.getSpace(self.size);
            }

            function getReach() {
                return PathfinderService.getReach(self.size);
            }

            function getBonus(type) {
                var value;
                value = null;
                //If a type is not specified, return nothing
                if (typeof type !== 'string') {
                    return value;
                }
                switch (value) {
                    case 'touch':
                        value = self.getBab() + self.scores.dexterity.modifier();
                        break;
                }
                return value;
            }

            function getFavoredSelections() {
                var selection;
                selection = {};
                // If the favored class doesn't exist
                if (self.hasClassByName(self.favoredClass) === false) {
                    return selection;
                }
                selection = self.classes[self.favoredClass].favoredSelections;
                return selection;
            }

            /**
             * Returns the actual number of spells the character should have based on class information, and associated ability score.
             * @param {string} spellLevel - The caster level.
             * @param {string} spellFormula - The formula used to determine the number of spells the character has based on their class level.
             * @param {object} spellsDetails - The associated information for spell casting in the specified class.
             * @returns {string|number} The number of spells available or a dash if they do not qualify for spells at this level.
             */
            function getNumberOfSpells(spellLevel, spellFormula, spellsDetails) {
                var spellCount, strMath, actualSpellLevel;
                if (typeof spellFormula !== 'string') {
                    console.warn('[character] getNumberOfSpells - The spellFormula parameter is not a string.');
                }
                if (typeof spellsDetails !== 'object') {
                    console.warn('[character] getNumberOfSpells - spellsDetails parameter is not an object.');
                }
                // Get the numerical spell level
                actualSpellLevel = parseInt(spellLevel);
                if (isNaN(actualSpellLevel)) {
                    console.warn('[character] getNumberOfSpells - The spell level could not be determined.');
                }
                // If 10 plus the spell level is higher than the associated ability score, the character cannot cast spells at this spell level
                if ((10 + actualSpellLevel) > self.scores[spellsDetails.ability].value()) {
                    return '-';
                }
                // Run the initial formula for spells
                spellCount = math.eval(spellFormula, self);
                // The math function required depends on the initial results therefore must be applied after the initial check.
                if (spellCount < 0) {
                    strMath = "floor(" + spellCount + ")";
                } else {
                    strMath = "ceil(" + spellCount + ")";
                }
                spellCount = math.eval(strMath);
                // If the number is less than 0, they do not qualify for spells of this level, so we return a dash to show they don't have access to this level.
                if (spellCount < 0) {
                    return '-';
                }
                // If they have access, we need to apply possible bonus spells based on the ability modifier bonus found here:
                // http://www.d20pfsrd.com/basics-ability-scores/ability-scores
                spellCount += PathfinderService.getBonusSpellsByModifier(actualSpellLevel, self.scores[spellsDetails.ability].modifier());
                return spellCount;
            }

            function getAttackBonus(attackType, retHighestOnly) {
                var iterativeAttack, atk, bab;
                if (typeof retHighestOnly === 'undefined') {
                    retHighestOnly = false;
                }
                // Let's start at zero
                atk = 0;
                // get the bab, we need it for the iterative
                bab = self.getBab();
                // Apply the base attack bonus
                atk += bab;
                // Apply appropriate modifier
                if (attackType === 'melee') {
                    atk += self.scores.strength.modifier();
                } else if (attackType === 'ranged') {
                    atk += self.scores.dexterity.modifier();
                }

                // If we only want the highest value,
                if (retHighestOnly) {
                    // send back the attack value.
                    return atk;
                }

                // OTHERWISE, let's build the iterative attack string!
                iterativeAttack = '';
                do {
                    if (atk >= 0) {
                        iterativeAttack += '+';
                    }
                    iterativeAttack += atk + '/';
                    atk -= 5;
                    bab -= 5;
                } while (bab / 5 > 0);
                // Remove the final slash (/)
                iterativeAttack = iterativeAttack.substr(0, iterativeAttack.length - 1);
                return iterativeAttack;
            }

            function collectClassesDetails(type) {
                var arrAbilities, propName, each, currentClass, prop, currentPropDetails, strTemp, matches, regex, i, currentMatch, formulaPosition, numericValue, extraText;
                arrAbilities = [];

                //If a type is not specified, return nothing
                if (typeof type !== 'string') {
                    return arrAbilities;
                }
                switch (type) {
                    case "defensive":
                        propName = "defensive ability";
                        break;
                    case "attack":
                        propName = "special attack";
                        break;
                    case "quality":
                        propName = "special quality";
                        break;
                    default:
                        propName = type;
                }

                for (each in self.classes) {
                    currentClass = self.classes[each];

                    //If the requested property is an array,
                    if (isArray(currentClass[propName])) {
                        //add each element to our array to send back.
                        for (i = 0; i < currentClass[propName].length; ++i) {
                            currentPropDetails = currentClass[propName][i];
                            arrAbilities.push(currentPropDetails);
                        }
                    }
                    //If the requested property is an object,
                    else if (typeof currentClass[propName] === 'object') {
                        //loop through each property in the object to create the text to display
                        for (prop in currentClass[propName]) {
                            currentPropDetails = currentClass[propName][prop];
                            strTemp = prop;
                            // If the details is an array, just list them out.
                            if (isArray(currentPropDetails)) {
                                strTemp += " (" + currentPropDetails.join(', ') + ")";
                            }
                            // If it's a string, just add it
                            else if (typeof currentPropDetails === 'string') {
                                strTemp += " (" + currentPropDetails + ")";
                            }
                            // If there is extra text, build the string
                            else if (currentPropDetails.extratext) {
                                //Handle extratext property
                                // Add the default container for extra info
                                strTemp += " (";
                                regex = /{{[^}]*}}/g;
                                extraText = currentPropDetails.extratext;
                                matches = extraText.match(regex);
                                // If there are formulas to run,
                                if (matches) {
                                    for (i = 0; i < matches.length; ++i) {
                                        currentMatch = matches[i];
                                        // remove the curly braces and the f to get the location
                                        formulaPosition = parseInt(currentMatch.replace(/{|}|f/g, ''));
                                        // If the number couldn't be parsed, we'll just display whatever it is...
                                        if (isNaN(formulaPosition)) {
                                            continue;
                                        }
                                        // run the formula with the character as the reference
                                        numericValue = math.eval(currentPropDetails.formula[formulaPosition], self);
                                        // replace the space holder with the real info
                                        extraText = extraText.replace(currentMatch, numericValue);
                                    }
                                }
                                strTemp += extraText + ")";
                            }
                            arrAbilities.push(strTemp);
                        }
                    }
                }

                return arrAbilities;
            }

            function collectSpelllikeDetails() {
                var arrAbilities, propName, each, currentClass, prop, currentPropDetails, strTemp, matches, regex, i, currentMatch, formulaPosition, numericValue, extraText;
                arrAbilities = [];

                for (each in self.classes) {
                    currentClass = self.classes[each];

                    if (typeof currentClass.spelllike === 'object') {
                        //loop through each property in the object to create the text to display
                        for (prop in currentClass[propName]) {
                            currentPropDetails = currentClass[propName][prop];
                            strTemp = prop;
                            // If there is no extra text we are done
                            if (!currentPropDetails.extratext) {
                                arrAbilities.push(strTemp);
                                continue;
                            }
                            // Add the default container for extra info
                            strTemp += " (";

                            regex = /{{[^}]*}}/g;
                            extraText = currentPropDetails.extratext;
                            matches = extraText.match(regex);
                            // If there are formulas to run,
                            if (matches) {
                                for (i = 0; i < matches.length; ++i) {
                                    currentMatch = matches[i];
                                    // remove the curly braces and the f to get the location
                                    formulaPosition = parseInt(currentMatch.replace(/{|}|f/g, ''));
                                    // If the number couldn't be parsed, we'll just display whatever it is...
                                    if (isNaN(formulaPosition)) {
                                        continue;
                                    }
                                    // run the formula with the character as the reference
                                    numericValue = math.eval(currentPropDetails.formula[formulaPosition], self);
                                    // replace the space holder with the real info
                                    extraText = extraText.replace(currentMatch, numericValue);
                                }
                            }
                            strTemp += extraText + ")";
                            arrAbilities.push(strTemp);
                        }
                    }
                }

                return arrAbilities;
            }

            function calculateConcentration(className, concentrationType) {
                var value, spelllike, casterLevel, abilityModifier;
                value = null;
                if (typeof self.classes[className] !== 'object' &&
                    typeof self.classes[className][concentrationType] !== 'object') {
                    return value;
                }
                spelllike = self.classes[className][concentrationType];
                casterLevel = math.eval(spelllike["caster level"], self);
                abilityModifier = self.scores[spelllike.ability].modifier();
                value = casterLevel + abilityModifier;
                return value;
            }

            function processFavoredOptions() {
                var positionInArray, raceData;
                // If no race is set, we have nothing to do
                if (self.race === null) {
                    return false;
                }
                // Get the position in the json array of races
                positionInArray = getArrayPosition(PathfinderService.json.races, self.race.name, {
                    ignoreCase: true,
                    targetProperty: "name"
                });
                if (positionInArray === -1) {
                    return false;
                }
                // If the character doesn't have levels in the favored class, there's something wrong
                // However, there is nothing to do here
                if (self.hasClassByName(self.favoredClass) === false) {
                    return false;
                }
                // We need the properly capitalized name of the class, and we don't want to take any chances on being wrong
                raceData = PathfinderService.getJsonData('races', positionInArray);
                self.favoredOptions = raceData.favored[self.favoredClass] || [];
                return true;
            }

            function updateFavoredClass(className) {
                className = className.toLowerCase();
                if (typeof self.classes[className] === 'undefined') {
                    return false;
                }
                self.favoredClass = className;
                self.processFavoredOptions();
                return true;
            }

            function updateFavoredSelections(location, selection) {
                var currentClass;
                // If the player doesn't have the favored class anymore, something is broken
                if (self.hasClassByName(self.favoredClass) === false) {
                    return false;
                }
                currentClass = self.classes[self.favoredClass];
                if (typeof currentClass.favoredSelections !== 'object') {
                    currentClass.favoredSelections = {};
                }
                currentClass.favoredSelections[location] = selection;
                return true;
            }

            /**
             * Determines if this character has a race.
             * @returns {boolean} If yes, true, otherwise false.
             */
            function hasRace() {
                return (self.race !== null);
            }

            /**
             * Determines if the character has levels in the class given.
             * @param {string} className - The class to check.
             * @returns {boolean} If the character has levels in the class name given it returns true, otherwise false.
             */
            function hasClassByName(className) {
                var currentName;
                if (typeof className !== 'string') {
                    return false;
                }
                // Loop through each class and see if it matches
                for (currentName in self.classes) {
                    if (currentName === className) {
                        return true;
                    }
                }
                return false;
            }

            /**
             * Apply a new set of ability scores to the character.
             * @param {object} scores - An object containing the new ability scores.
             * @returns {boolean} True if successful, otherwise false.
             */
            function applyAbilityScores(scores) {
                var each, tempObj;
                // If the parameter is not an array, do nothing
                if (typeof scores !== 'object') {
                    return false;
                }

                // Go through the 6 ability scores
                for (each in self.scores) {
                    // If the score type is not a number
                    if (typeof scores[each] !== 'number') {
                        // try to convert it into a number
                        scores[each] = parseInt(scores[each]);
                        // if it's not a number,
                        if (isNaN(scores[each])) {
                            // skip it
                            continue;
                        }
                    }
                    // Delete the current score, because are going to replace it
                    self.scores[each].remove({"type": "initial"});
                    // insert the initial score
                    tempObj = {
                        "type": "initial",
                        "value": scores[each]
                    };
                    self.scores[each].add(tempObj);
                }
                return true;
            }

            /**
             * Applies the given skills to the character.
             * @param {object} skills - The skills available for this character.
             * @returns {boolean} True if successful, otherwise false.
             */
            function applySkills(skills) {
                if (typeof skills !== 'object') {
                    return false;
                }
                self.skills = new Skills(skills, self.scores);
                return true;
            }

            function applyRaceChanges(race) {
                var i, currentQuality;
                if (typeof race !== 'object') {
                    console.log('[Character] applyRaceChanges - Given race is not an object.');
                    return false;
                }

                // If the race has been defined before, remove the added qualities
                if (self.race !== null) {
                    for (i = 0; i < self.race.qualities.length; ++i) {
                        currentQuality = self.race.qualities[i];
                        parseFormula(currentQuality.formula, self, currentQuality.selections, 'remove');
                    }
                }

                self.race = race;
                for (i = 0; i < self.race.qualities.length; ++i) {
                    currentQuality = self.race.qualities[i];
                    if (typeof currentQuality.status === 'string' && currentQuality.status === 'incomplete') {
                        //Add it to a list of items to resolve.
                        IssueHandler.addIssue(currentQuality);
                        continue;
                    }

                    // If the formula is not an object, or it's an array
                    // It's not completed, skip it
                    if (typeof currentQuality.formula !== 'object' || typeof currentQuality.formula.length !== 'undefined') {
                        console.log('[Character] applyRaceChanges - The formula for quality named "' + currentQuality.name + '" is not completed.');
                        continue;
                    }
                    parseFormula(currentQuality.formula, self, currentQuality.selections);
                }
                // Update Character Info
                self.processFavoredOptions();
                return true;
            }

            function applyClassChanges(newClass) {
                var i, each, currentClass, currentFeature, j, currentClassSkill;
                if (typeof newClass !== 'object') {
                    console.log('[Character] applyClassChanges - Given class is not an object.');
                    return false;
                }
                //Go through the existing classes,
                for (each in self.classes) {
                    currentClass = self.classes[each];
                    // If an existing class has the same name as the new class
                    if (newClass.name === currentClass.name) {
                        // Remove the class skills, because they may change
                        for (i = 0; i < currentClass.classSkills.length; ++i) {
                            currentClassSkill = currentClass.classSkills[i];
                            for (j = 0; j < self.classSkills.length; ++j) {
                                if (self.classSkills[i] === currentClassSkill) {
                                    self.classSkills.splice(j, 1);
                                    break;
                                }
                            }
                        }
                        self.skills.update(self.classSkills);
                        // Remove the added features
                        for (j = 0; j < currentClass.features.length; ++j) {
                            currentFeature = currentClass.features[j];
                            parseFormula(currentFeature.formula, self, currentFeature.selections, 'remove');
                        }
                    }
                }

                // Add the new class to the character
                self.classes[newClass.name.toLowerCase()] = newClass;
                currentClass = self.classes[newClass.name.toLowerCase()];

                // Set favored class if we don't have one or the one we have is no longer a class we have
                if (typeof self.favoredClass === 'undefined' || self.hasClassByName(self.favoredClass) === false) {
                    self.updateFavoredClass(currentClass.name);
                }

                // Add the new class skills
                for (i = 0; i < currentClass.classSkills.length; ++i) {
                    currentClassSkill = currentClass.classSkills[i];
                    self.classSkills.push(currentClassSkill);
                }
                self.skills.update(self.classSkills);
                // Apply the features content
                for (i = 0; i < currentClass.features.length; ++i) {
                    currentFeature = currentClass.features[i];
                    if (typeof currentFeature.status === 'string' && currentFeature.status === 'incomplete') {
                        //Add it to a list of items to resolve.
                        IssueHandler.addIssue(currentFeature);
                        continue;
                    }

                    // If the formula is not an object, or it's an array
                    // It's not completed, skip it
                    if (typeof currentFeature.formula !== 'object' || typeof currentFeature.formula.length !== 'undefined') {
                        console.log('[Character] applyClassChanges - The formula for quality named "' + currentFeature.name + '" is not completed.');
                        continue;
                    }
                    parseFormula(currentFeature.formula, self, currentFeature.selections);
                }
                // Apply Pathfinder's character advancement rules
                PathfinderService.checkCharacterAdvancement(self);
            }

            function applySelections(arrData) {
                var i, currentObj;
                for (i = 0; i < arrData.length; ++i) {
                    currentObj = arrData[i];
                    parseFormula(currentObj.formula, self, currentObj.selections);
                }
            }

            function generateCharacterCards() {
                var cards, card, i;
                cards = [
                    {
                        title: "Ability Scores",
                        formula: "equal(points, null)",
                        text: "You need to set ability scores for your character.",
                        priority: 1,
                        section: "Ability Scores"
                    },
                    {
                        title: "No Race",
                        formula: "equal(race, null)",
                        text: "You need to select a race for your character.",
                        priority: 1,
                        section: "Race"
                    },
                    {
                        title: "No Class",
                        formula: "equal(getCharacterLevel(), 0)",
                        text: "You need to select at least one level in a class.",
                        priority: 1,
                        section: "Class"
                    },
                    {
                        title: "Choose More Feats",
                        formula: "smaller(feats.data.length, feats.count.value())",
                        text: "You have feats to select.",
                        priority: 5,
                        section: "Feats"
                    },
                    {
                        title: "Too Many Feats",
                        formula: "larger(feats.data.length, feats.count.value())",
                        text: "You have too many feats selected.",
                        priority: 2,
                        section: "Feats"
                    },
                    {
                        title: "Need Skill Ranks",
                        formula: "smaller(getCurrentRanks(), getMaxTotalRanks())",
                        text: "You have skill ranks to place.",
                        priority: 5,
                        section: "Skills"
                    },
                    {
                        title: "Too Many Ranks",
                        formula: "larger(getCurrentRanks(), getMaxTotalRanks())",
                        text: "You have too many skill ranks placed.",
                        priority: 5,
                        section: "Skills"
                    },
                    {
                        title: "Favored Class Bonus",
                        formula: "larger(getCurrentRanks(), getMaxTotalRanks())",
                        text: "You have too many skill ranks placed.",
                        priority: 5,
                        section: "Skills"
                    }

                ];

                for (i = 0; i < cards.length; ++i) {
                    card = new ActionCard(cards[i]);
                    self.cards.push(card);
                }
            }

            function analyzeCharacterForCards() {
                var i, card, result;
                for (i = 0; i < self.cards.length; ++i) {
                    card = self.cards[i];
                    result = math.eval(card.getFormula(), self);
                    if (result) {
                        // If the result of the formula is true, activate the card.
                        card.active = true;
                    } else {
                        // If the result of the formula is true, deactivate the card.
                        card.active = false;
                    }
                }
            }
        }
    }]);
/**
 * Stores the objects that need user input before they can be applied to the character.
 */
angular.module('character').service('IssueHandler', function () {
    var arrIssues;

    // Variables
    arrIssues = [];

    // Functions
    this.addIssue = addIssue;
    this.getNext = getNext;
    this.getLength = getLength;

    /**
     * Adds an issue to the the issues list.
     * @param {object} issue - The formula to be completed.
     * @returns {boolean} True is successful, otherwise false.
     */
    function addIssue(issue) {
        if (typeof issue === 'undefined' && issue !== null) {
            return false;
        }
        arrIssues.push(issue);
        return true;
    }

    /**
     * Returns the next item in the issues array.
     * @returns {object|null} The next object in the array, or null if it's empty.
     */
    function getNext() {
        var arrTemp;
        if (arrIssues.length === 0) {
            return null;
        }
        arrTemp = arrIssues.splice(0, 1);
        if (arrTemp.length === 0) {
            return null;
        }
        return arrTemp[0];
    }

    /**
     * Getter for the array's length.
     * @returns {Number} The length of the issues array.
     */
    function getLength() {
        return arrIssues.length;
    }
});
/**
 * Stores the static pathfinder information that never changes.
 */
angular.module('character').service('PathfinderService', function ($http, $q, IssueHandler) {
    var self;
    self = this;
    this.json = {};
    this.getJsonData = getJsonData;
    this.calculateSave = calculateSave;
    this.calculateBab = calculateBab;
    this.getSaveModifier = getSaveModifier;
    this.getSpace = getSpace;
    this.getReach = getReach;
    this.getSpecialSizeModifier = getSpecialSizeModifier;
    this.getBonusSpellsByModifier = getBonusSpellsByModifier;
    this.checkCharacterAdvancement = checkCharacterAdvancement;
    this.canEquipItem = canEquipItem;
    self.parseOptions = parseOptions;
    // JSON
    this.getFromListByName = getFromListByName;
    this.getFromListCount = getFromListCount;
    this.getData = getData;

    function init() {
        var requestedData, current, i;
        requestedData = ['races', 'qualities', 'classes', 'feats', 'languages', 'equipment'];
        for (i = 0; i < requestedData.length; ++i) {
            current = requestedData[i];
            self.getData(current)
                .then(function (data) {
                    console.log('[PathfinderService] init - Data retrieved successfully.');
                }, function (error) {
                    // promise rejected
                    console.log('[PathfinderService] init - Data could not be retrieved.', error);
                });
        }
    }

    init();

    function canEquipItem(item) {
        var equipableItems, i, current;
        equipableItems = ["1-hand", "2-hand", "head", "headband", "eyes", "shoulders", "neck", "chest", "body", "armor", "belt", "wrists", "hands", "feet", "ring1", "ring2", "slotless"];
        for (i = 0; i < equipableItems.length; ++i) {
            current = equipableItems[i];
            if (item.slot === current) {
                return true;
            }
        }
        return false;
    }

    function calculateSave(type, level) {
        var save;
        save = 0;
        switch (type) {
            case "good":
                save += 2 + (level / 2);
                break;
            case "bad":
                save += level / 3;
                break;
        }
        return math.floor(save);
    }

    function calculateBab(type, level) {
        var bab;
        bab = 0;
        switch (type) {
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
    }

    function getSaveModifier(saveName) {
        var modifierName;
        if (typeof saveName !== 'string') {
            return null;
        }
        saveName = saveName.toLowerCase();
        switch (saveName) {
            case "fort":
            case "fortitude":
                modifierName = 'constitution';
                break;
            case "ref":
            case "reflex":
                modifierName = 'dexterity';
                break;
            case "wil":
            case "will":
                modifierName = 'wisdom';
                break;
            default:
                modifierName = null;
        }
        return modifierName;
    }

    function getSpace(creatureSize) {
        var space, size;
        // Remove the space in the creature's size, the type of large/huge/etc... doesn't matter for space
        size = creatureSize.toLowerCase().replace(/ ?\([^\)]*\)/g, '') || '';
        switch (size) {
            case 'fine':
                space = '1/2';
                break;
            case 'diminutive':
                space = '1';
                break;
            case 'tiny':
                space = '2-1/2';
                break;
            case 'small':
                space = '5';
                break;
            case 'medium':
                space = '5';
                break;
            case 'large':
                space = '10';
                break;
            case 'huge':
                space = '15';
                break;
            case 'gargantuan':
                space = '20';
                break;
            case 'colossal':
                space = '30';
                break;
        }
        return space;
    }

    /**
     * Returns the reach of the creature, based on their size, in feet.
     * @param {string} creatureSize
     * @returns {*}
     */
    function getReach(creatureSize) {
        var reach, size;
        size = creatureSize.toLowerCase() || '';
        switch (size) {
            case 'fine':
                reach = '0';
                break;
            case 'diminutive':
                reach = '0';
                break;
            case 'tiny':
                reach = '0';
                break;
            case 'small':
                reach = '5';
                break;
            case 'medium':
                reach = '5';
                break;
            case 'large (tall)':
                reach = '10';
                break;
            case 'large (long)':
                reach = '5';
                break;
            case 'huge (tall)':
                reach = '15';
                break;
            case 'huge (long)':
                reach = '10';
                break;
            case 'gargantuan (tall)':
                reach = '20';
                break;
            case 'gargantuan (long)':
                reach = '15';
                break;
            case 'colossal (tall)':
                reach = '30';
                break;
            case 'colossal (long)':
                reach = '20';
                break;
        }
        return reach;
    }

    function getSpecialSizeModifier(type) {
        var map;
        map = null;
        //If a type is not specified, return nothing
        if (typeof type !== 'string') {
            return null;
        }
        type = type.toLowerCase();
        switch (type) {
            case 'cmd':
                map = {
                    "fine": -8,
                    "diminutive": -4,
                    "tiny": -2,
                    "small": -1,
                    "medium": 0,
                    "large": 1,
                    "huge": 2,
                    "gargantuan": 4,
                    "colossal": 8
                };
                break;
        }
        if (map === null ||
            typeof map[type] !== 'object') {
            return null;
        }
        return map[type];
    }

    /**
     * Determines the number of bonus spells for a given spell level.
     * @param {number} spellLevel - The spell level used to determine the number of bonus spells.
     * @param {number} modifier - The modifier of the associated ability score used in the spell casting.
     * @returns {number} The number of bonus spells.
     */
    function getBonusSpellsByModifier(spellLevel, modifier) {
        var bonusSpells;
        if (spellLevel === 0 || modifier <= 0) {
            return 0;
        }
        bonusSpells = math.ceil(( modifier - ( spellLevel - 1 ) ) / 4);
        return bonusSpells;
    }

    function checkCharacterAdvancement(char) {
        var level, maxAbilityScores, currentScore, newBonus, currentFeat;
        // If the character hasn't done any character advancement checks yet, set the basics
        if (typeof char.advancement === 'undefined') {
            char.advancement = {
                abilityScores: [],
                favoredClass: '',
                favoredSelections: []
            };
        }
        level = char.getCharacterLevel();
        maxAbilityScores = math.floor(level / 4);

        //Handle removal of excess feats
        // If we have too many feats, pop them from the end until we are at the correct number.
        while (char.feats.data.length > char.feats.count.value()) {
            currentFeat = char.feats.data.pop();
            parseFormula(currentFeat.formula, char, currentFeat.selections, 'remove');
        }
        //Handle removal of character levels
        // If we have too many ability score bonuses, pop them from the end until we are at the correct number.
        while (char.advancement.abilityScores.length > maxAbilityScores) {
            currentScore = char.advancement.abilityScores.pop();
            parseFormula(currentFeature.formula, char, currentFeature.selections, 'remove');
        }
        //Handle addition of character levels
        // If we have too few ability score bonuses, add them until we are at the correct number
        while (char.advancement.abilityScores.length < maxAbilityScores) {
            newBonus = {
                "name": "Level " + ( ( char.advancement.abilityScores.length + 1 ) * 4 ) + " Bonus",
                "text": "Every four character levels (4th, 8th, 12th, etc...) a character adds 1 to an ability score.",
                "choices": 1,
                "status": "incomplete",
                "selections": [],
                "options": [
                    "strength",
                    "dexterity",
                    "constitution",
                    "intelligence",
                    "wisdom",
                    "charisma"
                ],
                "formula": {
                    "scores": {
                        "{{0}}": {
                            "add": {
                                "type": "advancement",
                                "value": 1
                            }
                        }
                    }
                }
            };
            char.advancement.abilityScores.push(newBonus);
            IssueHandler.addIssue(newBonus);
        }
    }

    // JSON gets
    function getData(prop) {
        var deferred = $q.defer();
        // If the skills are not pulled from server,
        if (typeof self.json[prop] === 'undefined') {
            // pull them from the server.
            return $http({
                method: "GET",
                url: "/json_db/" + prop + ".json"
            }).then(function success(response) {
                if (typeof response.data === 'object') {
                    self.json[prop] = response.data;
                    return response.data;
                } else {
                    // invalid response
                    return $q.reject(response.data);
                }
            }, function error(response) {
                //TODO: Probably should do something, like try again
                self.json.races = [];
                // Something went wrong
                console.log('[PathfinderService] getData - Response: ' + response.data);
                return $q.reject(self.json[prop]);
            });
        } else {
            // Resolve the promise because we have the data.
            deferred.resolve(self.json[prop]);
            // and return the promise, return the races array.
            return deferred.promise;
        }
    }

    function getFromListByName(listName, objName) {
        var tempObject, positionInArray;
        tempObject = null;
        // If the list doesn't exist, return null.
        if (!self.json[listName]) {
            return tempObject;
        }
        positionInArray = getArrayPosition(self.json[listName], objName, {
            "ignoreCase": true,
            "targetProperty": "name"
        });
        if (positionInArray > -1) {
            tempObject = self.json[listName][positionInArray];
        }
        return tempObject;
    }

    function getFromListCount(listName) {
        if (typeof self.json[listName] === 'undefined') {
            return 0;
        }
        return self.json[listName].length;
    }

    function getJsonData(name, positionInArray) {
        var jsonData = null;
        if (typeof name !== 'string') {
            console.log('[PathfinderService] getJsonData - name must be a string.');
            return jsonData;
        }
        if (typeof positionInArray !== 'number' || positionInArray < 0) {
            console.log('[PathfinderService] getJsonData - position must be a non-negative number.');
            return jsonData;
        }
        if (typeof this.json[name] === 'undefined') {
            console.log('[PathfinderService] getJsonData - "json.' + name + '" does not exist or not populated yet.');
            return jsonData;
        }
        try {
            jsonData = this.json[name][positionInArray];
        } catch (ex) {
            console.log('[PathfinderService] getJsonData - An error was encountered trying to access "json.' + name + '[' + positionInArray + ']"\n' +
                'Error Encountered: ' + ex.toString());
        }
        return jsonData;
    }

    function parseOptions(strOptions) {
        var i, options, targetOptions, currentOption, targetArray, each, targetProperty, stringToPush;
        if (typeof strOptions !== 'string') {
            return strOptions;
        }
        options = strOptions.split(':');
        if (options.length < 2) {
            return strOptions;
        }
        // options[0] is the object we are looking at to get our JSON list
        currentOption = options[0];
        if (typeof self.json[currentOption] === 'undefined') {
            return strOptions;
        }
        targetOptions = self.json[currentOption];
        targetProperty = options[1];
        // remove the first two options
        options.splice(0, 2);

        // Filter based on any other options
        while (options.length > 0) {
            //TODO: Handle filtering based on further options
        }
        // Build our array
        targetArray = [];
        if (!isArray(targetOptions)) {
            for (each in targetOptions) {
                currentOption = targetOptions[each];
                stringToPush = currentOption;
                if (targetProperty) {
                    stringToPush = currentOption[targetProperty];
                }
                targetArray.push(stringToPush.toLowerCase());
            }
        }
        if (isArray(targetOptions)) {
            for (i = 0; i < targetOptions.length; ++i) {
                currentOption = targetOptions[i];
                stringToPush = currentOption;
                if (targetProperty) {
                    stringToPush = currentOption[targetProperty];
                }
                targetArray.push(stringToPush.toLowerCase());
            }
        }
        return targetArray;
    }
});
/**
 * Handles all items to be viewed in detail.
 */
angular.module('character').service('Viewer', function () {
    var item, fromCharacter, modalType;

    // Variables
    item = null;
    fromCharacter = false;
    modalType = '';

    // Functions
    this.setItem = setItem;
    this.getItem = getItem;
    this.removeItem = removeItem;
    this.isFromCharacter = isFromCharacter;
    this.getModalType = getModalType;

    /**
     * Set an item in the viewer.
     * @param {object} newItem - The item to set in the viewer.
     * @param {string} type - The type of item being viewed. Usually a feat, skill, or language.
     * @param {boolean} fromChar - Whether the item is from the character, or not.
     * @returns {boolean} True for successful, otherwise false.
     */
    function setItem(newItem, type, fromChar) {
        // If the new feat doesn't exist
        if (typeof newItem === 'undefined' && newItem !== null) {
            return false;
        }
        item = newItem;
        modalType = type;
        fromCharacter = fromChar || false;

        return true;
    }

    /**
     * Returns the item to view, if one is found.
     * @returns {object|null} The item, or null if the item is not set.
     */
    function getItem() {
        if (item === null) {
            return null;
        }

        return item;
    }

    /**
     * Determines if the item being viewed is from a character, or a list of items.
     * @returns {boolean} True if from a character, otherwise false.
     */
    function isFromCharacter() {
        return fromCharacter;
    }

    /**
     * Determines if the item being viewed is from a character, or a list of items.
     * @returns {string} The item type being viewed.
     */
    function getModalType() {
        return modalType;
    }

    /**
     * Removes the item from the viewer.
     */
    function removeItem() {
        item = null;
        fromCharacter = false;
    }
});