"use strict";

module.exports = {
    "development" : {
        "storage" : "/home/vaibhav/Documents/temp",
        "bpm" : {
            "url" : "http://localhost:8080/bpm-engine/",
            "auth" : {
                "user" : "vijay",
                "pass" : "password"
            }
        },
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
        "bpm" : {
            "url" : "http://localhost:8080/bpm-engine/",
            "auth" : {
                "user" : "vijay",
                "pass" : "password"
            }
        },
        "sequelize": {
          "username": "root",
          "password": "password",
          "database": "dfs",
          "host": "localhost",
          "dialect": "mysql"
        }
    }
};
