"use strict";

const UserService = require('./user_service');

module.exports = class ApplicationService {
    constructor(db) {
        this.db = db;
        this.userService = new UserService(this.db);
    }

    createApplication(user, type, callback) {
        var that = this;
        this.userService.findUserByPhone(user.phone, function(err, foundUser) {
            if(err) {
                return callback(err);
            }

            that.db.Application.create({
                 stage: "NEW",
                 type: type,
             }).then(function(savedApplication) {
                 savedApplication.setUser(foundUser).then(function() {
                     return callback(null, savedApplication);
                 }).error(function(err) {
                     return callback(err);
                 });
             }).error(function(err) {
                 return callback(err);
             });

        });
    }

    findApplicationById(applicationId, callback) {
        this.db.Application.findById(applicationId).then(callback, callback);
    }

    updateStage(applicationId, stage, callback) {
        this.db.Application.update({stage: stage}, {
            where: {
                id: applicationId
            }
        }).then(callback, callback);
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
                    // savedForm.setApplication(application).then(function() {
                    //     return callback(null, savedForm);
                    // }).error(function(err) {
                    //     return callback(err);
                    // });
                }).error(function(err) {
                    return callback(err);
                });
            });
        });
    }
};
