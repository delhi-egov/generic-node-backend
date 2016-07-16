"use strict";

const Boom = require('boom');
const Joi = require('joi');
const Winston = require('winston');
const ApplicationService = require('../services/application_service');

var ready = function(server, next) {

    const applicationService = new ApplicationService(server.db);

    server.route({
        method: 'POST',
        path: '/create',
        config: {
            description: "This endpoint is used to create a new application",
            notes: 'Returns the created application object',
            tags: ['api', 'application'],
            validate: {
                payload: {
                    type: Joi.string().alphanum().required().description("The type of the application (new, renewal, etc)")
                }
            },
            handler: function(request, reply) {
                applicationService.createApplication(request.auth.credentials, request.payload.type, function(err, application) {
                    if(err) {
                        Winston.error(err.message);
                        return reply(Boom.badImplementation(err));
                    }

                    reply(application);
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/attachForm',
        config: {
            description: "This endpoint is used to attach a form to an application",
            notes: 'Returns true',
            tags: ['api', 'application'],
            validate: {
                payload: {
                    applicationId: Joi.number().integer().required().description("The application to which the form is being attached"),
                    type: Joi.string().alphanum().required().description("The type of the form (Form-I, Form-J, etc)"),
                    form: Joi.object().required().description("The content of the form")
                }
            },
            handler: function(request, reply) {
                applicationService.attachForm(request.auth.credentials.id, request.payload.applicationId, request.payload.type, request.payload.form, function(err, created) {
                    if(err) {
                        Winston.error(err.message);
                        if(err.message == 'Unauthorized') {
                            return reply(Boom.unauthorized("The application you are trying to modify does not belong to you"));
                        }
                        else {
                            return reply(Boom.badImplementation(err));
                        }
                    }

                    reply(true);
                });
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
    name : 'application_controller'
};
