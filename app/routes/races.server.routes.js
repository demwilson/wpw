var races = require('../controllers/races.server.controller.js'),
    users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
    app.route('/api/races/createMultiRaces')
        .post(users.requiresLogin, races.createMultiRaces);
    app.route('/api/races')
        .get(races.list)
        .post(users.requiresLogin, races.create);
    /*
    app.route('/api/races/:raceId')
        .get(races.read)
        .put(users.requiresLogin, races.hasAuthorization, races.update)
        .delete(users.requiresLogin, races.hasAuthorization, races.delete);
    */
    app.route('/api/races/:raceName')
        .get(races.read)
        .put(users.requiresLogin, races.hasAuthorization, races.update)
        .delete(users.requiresLogin, races.hasAuthorization, races.delete);

    app.param('raceId', races.raceByID);
    app.param('raceName', races.raceByName);
};