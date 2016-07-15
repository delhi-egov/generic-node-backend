'use strict';
module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
    type: DataTypes.STRING,
    path: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Document.belongsTo(models.Application, { foreignKey:'applicationId'});
      }
    }
  });
  return Document;
};
