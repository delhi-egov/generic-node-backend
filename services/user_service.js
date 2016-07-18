"use strict";

const Bcrypt = require('bcrypt');

module.exports = class UserService {
    constructor(db) {
        this.db = db;
    }

    findUserByPhone(phone, callback) {
        this.db.User.findOne({
            where: {
                phone: phone
            }
        }).then(function(user) {
            callback(null, user);
        }).error(function(err) {
            callback(err);
        });
    }

    createUser(user, callback) {
        var that = this;
        Bcrypt.hash(user.password, 8 , function(err, hash) {
            user.password = hash;
            that.db.User.create(user).then(function(createdUser) {
                callback(null, createdUser);
            }).error(function(err) {
                callback(err);
            });
        });
    }

    isPasswordCorrect(password, user, callback) {
        Bcrypt.compare(password, user.password, (err, isValid) => {
            callback(err, isValid);
        });
    }

    isValidUser(user, callback) {
        var that = this;
        this.findUserByPhone(user.phone, function(err, foundUser) {
            if(err) {
                return callback(err);
            }

            if(!foundUser) {
                callback(null, null);
            }
            else {
                that.isPasswordCorrect(user.password, foundUser, function(err, isValid) {
                    if(err) {
                        callback(err);
                    }
                    else if(isValid) {
                        callback(null, foundUser);
                    }
                    else {
                        callback(null, null);
                    }
                });
            }
        });
    }

    updateUser(user, callback) {
        Bcrypt.hash(user.password, 8 , function(err, hash) {
            user.password = hash;
            this.db.User.update(user, {
                where: {
                    phone: user.phone
                }
            }).spread(function(count, users) {
                callback(null, users[0]);
            }).error(function(err) {
                callback(err);
            });
        });
    }
};
