var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session');

module.exports = function() {
    var app = express();

    app.use(bodyParser.json({limit: '10mb'}));
    app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'OurSuperSecretCookieOfDOOOOOOOOOOOM'
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/feats.server.routes.js')(app);
    require('../app/routes/races.server.routes.js')(app);
    require('../app/routes/wpw.server.routes.js')(app);

    app.use(express.static('./public'));

    return app;
};