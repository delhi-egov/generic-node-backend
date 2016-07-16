"use strict";

var fs        = require('fs');
var path      = require('path');

var ready = function(server, next) {
    var Sequelize = require('sequelize');
    var sequelize = new Sequelize(server.env.sequelize.database, server.env.sequelize.username, server.env.sequelize.password, {
        host: server.env.sequelize.host,
        dialect: server.env.sequelize.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        storage: server.env.sequelize.storage
      });

    var db = {};

    fs
      .readdirSync(__dirname + "/../models/")
      .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
      })
      .forEach(function(file) {
        var model = sequelize['import'](path.join(__dirname + "/../models/", file));
        db[model.name] = model;
      });

    Object.keys(db).forEach(function(modelName) {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

    server.decorate('server', 'db', db);
    next();
};

exports.register = function (server, options, next) {
    server.dependency('env', ready);
    next();
};

exports.register.attributes = {
    name : 'db'
};
