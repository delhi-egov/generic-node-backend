"use strict";

const Boom = require('boom');
const Joi = require('joi');
const Winston = require('winston');
const ApplicationService = require('../services/application_service');

var ready = function(server, next) {
    const applicationService = new ApplicationService(server.db, server.env);

    server.route({
        method: 'POST',
        path: '/notification',
        config: {
            description: "This endpoint hit by BPM engine to signal completion of processing of an application",
            notes: 'Based on the notification, the application status is updated',
            tags: ['api', 'notification'],
            auth: {
                strategy: 'simple',
                scope: "ADMIN"
            },
            validate: {
                payload: {
                    executionId: Joi.string().description("The execution id"),
                    processInstanceId: Joi.string().description("The process instance id"),
                    processDefinitionId: Joi.string().description("The process definition id"),
                    //entity: Joi.any().description("The process instance object"),
                    businessKey: Joi.string().description("The application id"),
                    type: Joi.string().description("Event type")
                }
            },
            handler: function(request, reply) {
                applicationService.updateStatus(parseInt(request.payload.businessKey), 'FINISHED', function(err, updatedApplication) {
                    if(err) {
                        Winston.error(err.message);
                        return reply(Boom.badImplementation(err));
                    }

                    reply(updatedApplication);
                });
            }
        }
    });

    next();
};

exports.register = function (server, options, next) {
    server.dependency(['auth'], ready);
    next();
};

exports.register.attributes = {
    name : 'notification_controller'
};
