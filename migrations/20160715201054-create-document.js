'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      applicationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Applications",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    }).then(function() {
      return queryInterface.addIndex('Documents', ['applicationId', 'type'], {indicesType: 'UNIQUE'});
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Documents');
  }
};
