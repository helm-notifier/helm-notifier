'use strict';
const i18n = require('../../helpers/i18n');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      full_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      reset_token_expires_at: {
        type: Sequelize.DATE,
      },
      reset_token: {
        type: Sequelize.STRING,
      },
      display_name: {
        type: Sequelize.STRING(70),
        allowNull: false,
      },
      given_name: {
        type: Sequelize.STRING(35)
      },
      family_name: {
        type: Sequelize.STRING(35)
      },
      avatar_url: {
        type: Sequelize.STRING
      },
      last_locale: {
        type: Sequelize.STRING,
        defaultValue: i18n.config.defaultLocale,
      },
      api_token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      group: {
        type: Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      ip: {
        type: Sequelize.STRING,
      },
      last_ips: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
