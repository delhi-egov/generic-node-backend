'use strict';
module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
    type: DataTypes.STRING,
    path: DataTypes.STRING,
    applicationId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Document.belongsTo(models.Application);
      }
    },
    paranoid: true,
  });
  return Document;
};
