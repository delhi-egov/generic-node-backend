"use strict";

module.exports = {
    "development" : {
        "storage" : "/home/vaibhav/Documents/temp",
        "bpm" : {
            "url" : "http://localhost:9090/",
            "auth" : {
                "user" : "kermit",
                "pass" : "kermit"
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
            "url" : "http://localhost:9090/",
            "auth" : {
                "user" : "kermit",
                "pass" : "kermit"
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
