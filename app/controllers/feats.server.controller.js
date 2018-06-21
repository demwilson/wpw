var mongoose = require('mongoose'),
    Feat = mongoose.model('Feat');

var getErrorMessage = function(err) {
    if (err.message) {
        return err.message;
    } else {
        return 'Unknown server error';
    }
};

exports.create = function(req, res) {
    var feat = new Feat(req.body);
    feat.creator = req.user;
    feat.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(feat);
        }
    });
};

exports.createMultiFeats = function(req, res) {
    var feat, allTheFeats, i;
    allTheFeats = req.body;
    for (i = 0; i < allTheFeats.length; ++i) {
        feat = new Feat(allTheFeats[i]);
        feat.creator = req.user;
        feat.save(function(err) {
            if (err) {
            } else {
                //
            }
        });
    }
    res.json('{"message": "You have successfully added ' + allTheFeats.length + ' feats to the database."}');
};

exports.list = function(req, res) {
    Feat.find().sort('name').populate('creator', 'name').exec(function(err, feats) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(feats);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.feat);
};

exports.featByID = function(req, res, next, id) {
    Feat.findById(id).populate('creator', 'name').exec(function(err, feat) {
        if (err)
            return next(err);

        if (!feat)
            return next(new Error('Failed to load feat by id: ' + id));

        req.feat = feat;
        next();
    });
};

exports.featByName = function(req, res, next, name) {
    Feat.findOne({ "name": name }).populate('creator', 'name').exec(function(err, feat) {
        if (err)
            return next(err);

        if (!feat)
            return next(new Error('Failed to load feat by name: ' + name));

        req.feat = feat;
        next();
    });;
};

exports.update = function(req, res) {
    var feat, updatedFeat;
    updatedFeat = req.body;
    feat = req.feat;

    // Update the content
    feat.name = updatedFeat.name;
    feat.type = updatedFeat.type;
    feat.flavor_text = updatedFeat.flavor_text;
    feat.benefit = updatedFeat.benefit;
    feat.normal = updatedFeat.normal;
    feat.special = updatedFeat.special;
    feat.requires_value = updatedFeat.requires_value;
    feat.prerequisites = updatedFeat.prerequisites;
    feat.modifiers = updatedFeat.modifiers;
    feat.source = updatedFeat.source;
    feat.url = updatedFeat.url;

    feat.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(feat);
        }
    });
};

exports.delete = function(req, res) {
    var feat = req.feat;
    feat.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(feat);
        }
    });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.feat.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};