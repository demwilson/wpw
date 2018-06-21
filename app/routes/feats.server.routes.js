var feats = require('../controllers/feats.server.controller.js'),
    users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
    app.route('/api/feats/createMultiFeats')
        .post(users.requiresLogin, feats.createMultiFeats);

    app.route('/api/feats')
        .get(feats.list)
        .post(users.requiresLogin, feats.create);

    /*
    app.route('/api/feats/:featId')
        .get(feats.read)
        .put(users.requiresLogin, feats.hasAuthorization, feats.update)
        .delete(users.requiresLogin, feats.hasAuthorization, feats.delete);
    */
    app.route('/api/feats/:featName')
        .get(feats.read)
        .put(users.requiresLogin, feats.hasAuthorization, feats.update)
        .delete(users.requiresLogin, feats.hasAuthorization, feats.delete);

    //app.param('featId', feats.featByID);
    app.param('featName', feats.featByName);
};