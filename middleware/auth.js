"use strict";

const AuthCookie = require("hapi-auth-cookie");

var ready = function(server, next) {
    server.register(AuthCookie, (err) => {
        if(err) {
            throw err;
        }
        server.auth.strategy("session", "cookie", {
            password: "this-password-must-come-from-env-variable-hence-remove-from-here-at-deploy-time", // cookie secret
            cookie: "delhi-gov-dfs-auth", // Cookie name
            ttl: 24 * 60 * 60 * 1000, // Set session to 1 day
            isSecure: false, //TODO: Fixme
        });
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
