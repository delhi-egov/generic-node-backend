"use strict";

const Env = require('../env.js');

module.exports = {
    "production": Env.production.sequelize,
    "development": Env.development.sequelize
};
