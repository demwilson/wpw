var mongoose = require('mongoose'),
    Race = mongoose.model('Race');

var getErrorMessage = function(err) {
    if (err.message) {
        return err.message;
    } else {
        return 'Unknown server error';
    }
};

exports.create = function(req, res) {
    var race = new Race(req.body);
    race.creator = req.user;
    race.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(race);
        }
    });
};

exports.createMultiRaces = function(req, res) {
    var item, allItems, i;
    allItems = req.body;
    for (i = 0; i < allItems.length; ++i) {
        item = new Race(allItems[i]);
        item.creator = req.user;
        item.save(function(err) {
            if (err) {
            } else {
                //
            }
        });
    }
    res.json('{"message": "You have successfully added ' + allItems.length + ' races to the database."}');
};

exports.list = function(req, res) {
    Race.find().sort('name').populate('creator', 'name').exec(function(err, races) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(races);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.race);
};

exports.raceByID = function(req, res, next, id) {
    Race.findById(id).populate('creator', 'name').exec(function(err, race) {
        if (err)
            return next(err);

        if (!race)
            return next(new Error('Failed to load race by id: ' + id));

        req.race = race;
        next();
    });
};

exports.raceByName = function(req, res, next, name) {
    Race.findOne({ "name": name }).populate('creator', 'name').exec(function(err, race) {
        if (err)
            return next(err);

        if (!race)
            return next(new Error('Failed to load race by name: ' + name));

        req.race = race;
        next();
    });;
};

exports.update = function(req, res) {
    var item, updatedItem;
    updatedItem = req.body;
    item = req.race;

    // TODO: Update the content to race fields
    item.name = updatedItem.name;
    item.type = updatedItem.type;
    item.flavor_text = updatedItem.flavor_text;
    item.benefit = updatedItem.benefit;
    item.normal = updatedItem.normal;
    item.special = updatedItem.special;
    item.requires_value = updatedItem.requires_value;
    item.prerequisites = updatedItem.prerequisites;
    item.modifiers = updatedItem.modifiers;
    item.source = updatedItem.source;
    item.url = updatedItem.url;

    item.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(item);
        }
    });
};

exports.delete = function(req, res) {
    var race = req.race;
    race.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(race);
        }
    });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.race.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};