'use strict';
module.exports = function(sequelize, DataTypes) {
  var Application = sequelize.define('Application', {
    type: DataTypes.STRING,
    stage: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        Application.belongsTo(models.User);
      }
    },
    paranoid: true,
  });
  return Application;
};
