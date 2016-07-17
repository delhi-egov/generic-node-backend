"use strict";

const Boom = require('boom');
const Joi = require('joi');
const Winston = require('winston');
const UserService = require('../services/user_service');

var ready = function(server, next) {

    const userService = new UserService(server.db);

    server.route({
        method: 'POST',
        path: '/user/register',
        config: {
            auth: false,
            description: "This endpoint is used to register a new user",
            notes: 'Phone number is the primary identifier. Returns the complete registered user object',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    name: Joi.string().required().description("Name of the user"),
                    phone: Joi.number().integer().required().description("Mobile number of the user"),
                    email: Joi.string().email().required().description("Email address of the user"),
                    password: Joi.string().required().description("Password of the user")
                }
            },
            handler: function(request, reply) {
                userService.findUserByPhone(request.payload.phone, function(err, user) {
                    if(err) {
                        Winston.error(err.message);
                        return reply(Boom.badImplementation(err));
                    }

                    if(user) {
                        return reply(Boom.badRequest("User with given phone number already exists"));
                    }

                    request.payload.scope = 'USER';
                    request.payload.status = 'ACTIVE';
                    request.payload.lastLogin = new Date();

                    userService.createUser(request.payload, function(err, createdUser) {
                        if(err) {
                            Winston.error(err.message);
                            return reply(Boom.badImplementation(err));
                        }

                        return reply(createdUser);
                    });
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/user/isValid',
        config: {
            auth: false,
            description: "This endpoint is used to test if a user is valid",
            notes: 'Phone number and password must be passed. Returns boolean',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    phone: Joi.number().integer().required().description("Mobile number of the user"),
                    password: Joi.string().required().description("Password of the user")
                }
            },
            handler: function(request, reply) {
                userService.isValidUser(request.payload, function(err, user) {
                    if(err) {
                        Winston.error(err.message);
                        return reply(Boom.badImplementation(err));
                    }

                    if(user) {
                        reply(true);
                    }
                    else {
                        reply(false);
                    }
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/user/login',
        config: {
            auth: {
                mode: 'try'
            },
            description: "This endpoint is used login the user",
            notes: 'Phone number and password must be passed. Returns logged in user info',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    phone: Joi.number().integer().required().description("Mobile number of the user"),
                    password: Joi.string().required().description("Password of the user")
                }
            },
            handler: function(request, reply) {
                if (request.auth.isAuthenticated) {
                    return reply(request.auth.credentials);
                }
                userService.isValidUser(request.payload, function(err, user) {
                    if(err) {
                        Winston.error(err.message);
                        return reply(Boom.badImplementation(err));
                    }

                    request.cookieAuth.set(user);

                    reply(user);
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/user/logout',
        config: {
            auth: {
                mode: 'optional'
            },
            description: "This endpoint is used logout the user",
            notes: 'Returns true',
            tags: ['api', 'user'],
            handler: function(request, reply) {
                request.cookieAuth.clear();
                return reply(true);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/user/me',
        config: {
            description: "This endpoint is used to get logged in user's information",
            notes: 'Returns the complete user object',
            tags: ['api', 'user'],
            handler: function(request, reply) {
                reply(request.auth.credentials);
            }
        }
    });

    next();
};

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'user_controller'
};
