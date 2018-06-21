var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');

module.exports = function(app) {
    app.route('/register')
        .get(users.renderRegister)
        .post(users.register);

    app.route('/login')
        .get(users.renderLogin)
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));

    app.get('/oauth/facebook', passport.authenticate('facebook', {
        failureRedirect: '/login',
        scope:['email']
    }));

    app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/login',
        successRedirect: '/',
        scope:['email']
    }));

    app.get('/logout', users.logout);
};