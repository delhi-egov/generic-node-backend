"use strict";

const UserService = require('./user_service');
const ActivitiClient = require('node-activiti-client');

module.exports = class ApplicationService {
    constructor(db, env) {
        this.db = db;
        this.userService = new UserService(this.db);
        this.activitiClient = new ActivitiClient(env.bpm.url, env.bpm.auth);
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

    completeApplication(userId, applicationId, callback) {
        var that = this;

        this.findApplicationById(applicationId, function(application) {
            application.getUser().then(function(user) {
                if(user.id != userId) {
                    return callback(new Error("Unauthorized"));
                }

                var submittedForms = {};
                var submittedDocuments = {};

                that.db.Form.findAll({
                    where: {
                        applicationId: applicationId
                    }
                }).then(function(forms) {
                    forms.forEach(function(form, index) {
                        submittedForms[form.type] = form.data;
                    });
                    that.db.Document.findAll({
                        where: {
                            applicationId: applicationId
                        }
                    }).then(function(documents) {
                        documents.forEach(function(document, index) {
                            submittedDocuments[document.type] = document.path;
                        });

                        var variables = [
                            {
                                name: 'forms',
                                value: submittedForms
                            },
                            {
                                name: 'documents',
                                value: submittedDocuments
                            },
                            {
                                name: 'user',
                                value: user
                            }
                        ];
                        that.activitiClient.startProcessInstance(application.type, application.id, variables, callback);
                    });
                });
            });
        });
    }

    getApplicationStatus(userId, applicationId, callback) {
        var that = this;

        this.findApplicationById(applicationId, function(application) {
            application.getUser().then(function(user) {
                if(user.id != userId) {
                    return callback(new Error("Unauthorized"));
                }
                that.activitiClient.getProcessStatusByBusinessKey(applicationId, callback);
            });
        });
    }

    getTasksForApplication(userId, applicationId, callback) {
        var that = this;

        this.findApplicationById(applicationId, function(application) {
            application.getUser().then(function(user) {
                if(user.id != userId) {
                    return callback(new Error("Unauthorized"));
                }
                that.activitiClient.getProcessTasks(applicationId, callback);
            });
        });
    }

    getVariablesForTask(userId, applicationId, taskId, callback) {
        var that = this;

        this.findApplicationById(applicationId, function(application) {
            application.getUser().then(function(user) {
                if(user.id != userId) {
                    return callback(new Error("Unauthorized"));
                }
                that.activitiClient.getProcessTasks(applicationId, function(err, response) {
                    if(err) {
                        return callback(err);
                    }
                    var found = false;
                    response.data.forEach(function(task, index) {
                        if(task.id == taskId) {
                            found = true;
                        }
                    });
                    if(!found) {
                        return callback(new Error("Unauthorized"));
                    }
                    that.activitiClient.getTaskVariables(taskId, callback);
                });
            });
        });
    }

    completeTask(userId, applicationId, taskId, callback) {
        var that = this;

        this.findApplicationById(applicationId, function(application) {
            application.getUser().then(function(user) {
                if(user.id != userId) {
                    return callback(new Error("Unauthorized"));
                }
                that.activitiClient.getProcessTasks(applicationId, function(err, response) {
                    if(err) {
                        return callback(err);
                    }
                    var found = false;
                    response.data.forEach(function(task, index) {
                        if(task.id == taskId) {
                            found = true;
                        }
                    });
                    if(!found) {
                        return callback(new Error("Unauthorized"));
                    }
                    that.activitiClient.completeTask(taskId, [], callback);
                });
            });
        });
    }
};
