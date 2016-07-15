"use strict";

module.exports = {
    "development" : {
        "storage" : "/home/vaibhav/Documents/temp",
        "sequelize": {
          "username": "root",
          "password": "password",
          "database": "dfs",
          "host": "localhost",
          "dialect": "mysql"
        }
    },
    "production" : {
        "storage" : "/home/vaibhav/Documents/temp",
        "sequelize": {
          "username": "root",
          "password": "password",
          "database": "dfs",
          "host": "localhost",
          "dialect": "mysql"
        }
    }
};
