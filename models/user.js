var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const DateOnly = require('mongoose-dateonly')(mongoose);
var schema = mongoose.Schema({

        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        birthdate: {
            type: Date,
            required: true
        },
        contact: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        imageURL: {
            type: String,
            trim: false
        },
        password: {
            type: String,
            required: true
        },
        isVerified: { 
            type: Boolean, 
            default: false 
        }, // New field for email verification
        
    }, {
        versionKey: false,
        timestamps: true
    }
);

schema.pre('save', function (next) {

    var user = this;

    // generate a salt

    if (user.isModified("password") || user.isNew) {

        bcrypt.genSalt(10, function (error, salt) {

            if (error) return next(error);

            // hash the password along with our new salt

            bcrypt.hash(user.password, salt, function (error, hash) {

                if (error) return next(error);

                // override the cleartext password with the hashed one

                user.password = hash;

                next(null, user);
            });
        });

    } else {
        next(null, user);
    }
});

/**
 * Compare raw and encrypted password
 * @param password
 * @param callback
 */
schema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (error, match) {
        if (error) callback(error);
        if (match) {
            callback(null, true);
        } else {
            callback(error, false);
        }
    });
}

module.exports = mongoose.model("Users", schema, "Users");