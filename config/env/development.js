var port = 80;

module.exports = {
    port: port,
    db: 'mongodb://localhost/wpw',
    facebook: {
        clientID: '1034451036614734',
        clientSecret: '71265c40d7a02b0fa1ce0222e8eb1f69',
        callbackURL: 'http://localhost:'+ port +'/oauth/facebook/callback'
    }
};
