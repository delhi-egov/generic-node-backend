"use strict";

const AuthCookie = require("hapi-auth-cookie");
const BasicAuth = require("hapi-auth-basic");
const UserService = require("../services/user_service");

var ready = function(server, next) {
    const userService = new UserService(server.db);
    var validate = function(request, phone, password, callback) {
        userService.isValidUser({phone: phone, password: password}, function(err, user) {
            callback(err, user !== null, user);
        });
    };
    server.register([AuthCookie, BasicAuth], (err) => {
        if(err) {
            throw err;
        }
        server.auth.strategy("session", "cookie", {
            password: "this-password-must-come-from-env-variable-hence-remove-from-here-at-deploy-time", // cookie secret
            cookie: "delhi-gov-dfs-auth", // Cookie name
            ttl: 24 * 60 * 60 * 1000, // Set session to 1 day
            isSecure: false, //TODO: Fixme
            isHttpOnly: false,
        });
        server.auth.strategy('simple', 'basic', { validateFunc: validate });
        server.auth.default('session');
    });

    next();
};

exports.register = function (server, options, next) {
    server.dependency('db', ready);
    next();
};

exports.register.attributes = {
    name : 'auth'
};
