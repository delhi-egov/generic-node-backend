"use strict";

const Boom = require('boom');
const Joi = require('joi');
const Winston = require('winston');
const fs = require('fs');
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
                    type: Joi.string().required().description("The type of the application (new, renewal, etc)")
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
        path: '/changeStage',
        config: {
            description: "This endpoint is used to change the stage of an application",
            notes: 'Returns the updated application object',
            tags: ['api', 'application'],
            validate: {
                payload: {
                    applicationId: Joi.number().integer().required().description("The application which had to be updated"),
                    stage: Joi.string().required().description("The stage of the application (form-filled, payment-done, etc)")
                }
            },
            handler: function(request, reply) {
                applicationService.updateStage(request.auth.credentials.id, request.payload.applicationId, request.payload.stage, function(err, application) {
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
                    type: Joi.string().required().description("The type of the form (Form-I, Form-J, etc)"),
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

    server.route({
            method: 'POST',
            path: '/attachDocument',
            config: {
                description: "This endpoint is used to attach a document to an application",
                notes: 'Returns true',
                tags: ['api', 'application'],
                validate: {
                    payload: {
                        form: Joi.object({
                            applicationId: Joi.number().integer().required().description("The application to which the document is being attached"),
                            type: Joi.string().required().description("The type of the document (Form-I, Form-J, etc)"),
                        }).required().description("The content of the form"),
                        file: Joi.any().meta({ swaggerType: 'file' }).description('The file to be uploaded')
                    }
                },
                payload: {
                    output: 'stream',
                    parse: true
                },
                handler: function(request, reply) {
                    var data = request.payload;
                    if (data.file) {
                        var name = data.file.hapi.filename + '.' + request.auth.credentials.phone + '.' + Date.now();
                        var path = server.env.storage + "/" + name;
                        var file = fs.createWriteStream(path);

                        file.on('error', function (err) {
                            Winston.error(err);
                        });

                        data.file.on('end', function (err) {
                            applicationService.attachDocument(request.auth.credentials.id, request.payload.form.applicationId, request.payload.form.type, path, function(err, created) {
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
                        });

                        data.file.pipe(file);
                    }
                    else {
                        reply(Boom.badRequest("No file uploaded"));
                    }
                },
                plugins: {'hapiAuthorization': {role: 'ADMIN'}}
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
