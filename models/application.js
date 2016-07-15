'use strict';
module.exports = function(sequelize, DataTypes) {
  var Application = sequelize.define('Application', {
    type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Application.belongsTo(models.User, { foreignKey:'userId'});
      }
    }
  });
  return Application;
};
