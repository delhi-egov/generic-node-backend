"use strict";

var ready = function(server, next) {
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: server.env.storage,
                listing: true
            }
        }
    });

    next();
};

exports.register = function (server, options, next) {
    server.dependency(['auth', 'inert'], ready);
    next();
};

exports.register.attributes = {
    name : 'static_controller'
};
