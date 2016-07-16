"use strict";

const UserService = require('./user_service');

module.exports = class ApplicationService {
    constructor(db) {
        this.db = db;
        this.userService = new UserService(this.db);
    }

    createApplication(user, type, callback) {
        this.db.Application.create({
             stage: "NEW",
             type: type,
             userId: user.id
         }).then(function(savedApplication) {
             return callback(null, savedApplication);
         }).error(function(err) {
             return callback(err);
         });
    }

    findApplicationById(applicationId, callback) {
        this.db.Application.findById(applicationId).then(callback);
    }

    updateStage(userId, applicationId, stage, callback) {
        this.findApplicationById(applicationId, function(application) {
            application.getUser().then(function(user) {
                if(user.id != userId) {
                    return callback(new Error("Unauthorized"));
                }
                application.update({stage: stage}).then(function(updatedApplication) {
                    callback(null, updatedApplication);
                }).error(function(err) {
                    callback(err);
                });
            });
        });
    }

    attachForm(userId, applicationId, formType, formData, callback) {
        var that = this;

        this.findApplicationById(applicationId, function(application) {
            application.getUser().then(function(user) {
                if(user.id != userId) {
                    return callback(new Error("Unauthorized"));
                }
                that.db.Form.upsert({
                    type: formType,
                    data: JSON.stringify(formData),
                    applicationId: application.id
                }).then(function(created) {
                    return callback(null, created);
                }).error(function(err) {
                    return callback(err);
                });
            });
        });
    }

    attachDocument(userId, applicationId, documentType, documentPath, callback) {
        var that = this;

        this.findApplicationById(applicationId, function(application) {
            application.getUser().then(function(user) {
                if(user.id != userId) {
                    return callback(new Error("Unauthorized"));
                }
                that.db.Document.upsert({
                    type: documentType,
                    path: documentPath,
                    applicationId: application.id
                }).then(function(created) {
                    return callback(null, created);
                }).error(function(err) {
                    return callback(err);
                });
            });
        });
    }
};
