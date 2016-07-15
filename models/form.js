'use strict';
module.exports = function(sequelize, DataTypes) {
  var Form = sequelize.define('Form', {
    type: DataTypes.STRING,
    data: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Form.belongsTo(models.Application, { foreignKey:'applicationId'});
      }
    }
  });
  return Form;
};
