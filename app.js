"use strict";

const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const Winston = require('winston');
const Pack = require('./package');
const Env = require('./middleware/env');
const Auth = require('./middleware/auth');
const Db = require('./middleware/db');
const UserController = require('./controllers/user_controller');
const StaticController = require('./controllers/static_controller');
const ApplicationController = require('./controllers/application_controller');
const NotificationController = require('./controllers/notification_controller');

const server = new Hapi.Server();
server.connection({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 9999,
    routes: {
        cors: true
    }
});

// Cookie config
server.state("delhi-gov-dfs", {
    ttl: 24 * 60 * 60 * 1000,  //One day
    isSecure: false, //TODO: Fixme
    path: "/",
    encoding: "iron",
    password: "this-password-must-come-from-env-variable-hence-remove-from-here-at-deploy-time", //TODO: Fixme
    isHttpOnly: false,
});

// Plugin options
const options = {
    swagger: {
        info: {
            title: 'API Documentation',
            version: Pack.version
        },
        payloadType: 'form'
    },
    inert: {

    },
    vision: {

    },
    env: {

    },
    auth: {

    },
    db: {

    },
    user_controller: {
        routes: {
            prefix: "/user"
        }
    },
    static_controller: {

    },
    application_controller: {
        routes: {
            prefix: "/application"
        }
    },
    notification_controller: {

    },
};

const plugins = [
    {
        register: Inert,
        options: options.inert
    },
    {
        register: Vision,
        options: options.vision
    },
    {
        register: HapiSwagger,
        options: options.swagger
    },
    {
        register: Env,
        options: options.env
    },
    {
        register: Auth,
        options: options.auth
    },
    {
        register: Db,
        options: options.db
    },
    {
        register: UserController,
        options: options.user_controller
    },
    {
        register: StaticController,
        options: options.static_controller
    },
    {
        register: ApplicationController,
        options: options.application_controller
    },
    {
        register: NotificationController,
        options: options.notification_controller
    },
];

//Register plugins
server.register(plugins, (err) => {
    if(err) {
        throw(err);
    }

    // Start the server
    server.start((err) => {
        if (err) {
            throw err;
        }
        Winston.info('Server running at:', server.info.uri);
    });
});
