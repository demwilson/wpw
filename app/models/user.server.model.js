var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: String,
    username: {
        type: String,
        trim: true,
        unique: true,
        require: true,
        validate: {
            validator: function(value) {
                if ( typeof value == "string" && value.length == 0 ) {
                    return false;
                }
                return true;
            },
            message: 'Username cannot be blank!'
        }
    },
    password: String,
    provider: String,
    providerId: String,
    providerData: {}
});

//TODO: Use salt instead of md5. URL: http://stackoverflow.com/questions/17201450/salt-and-hash-password-in-nodejs-w-crypto
UserSchema.pre('save',
    function(next) {
        if (this.password) {
            var md5 = crypto.createHash('md5');
            this.password = md5.update(this.password).digest('hex');
        }
        next();
    }
);

UserSchema.methods.authenticate = function(password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');

    return this.password === md5;
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne(
        {username: possibleUsername},
        function(err, user) {
            if (!err) {
                if (!user) {
                    callback(possibleUsername);
                }
                else {
                    return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
                }
            }
            else {
                callback(null);
            }
        }
    );
};

mongoose.model('User', UserSchema);