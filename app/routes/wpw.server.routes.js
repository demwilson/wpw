module.exports = function(app) {
    var index = require('../controllers/wpw.server.controller');
    app.get('/dashboard', index.render);
};