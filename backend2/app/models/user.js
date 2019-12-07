/* eslint-disable no-param-reassign */
const isSANB = require('is-string-and-not-blank');
const randomstring = require('randomstring-extended');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const bull = require('../../bull');
const i18n = require('../../helpers/i18n');
const logger = require('../../helpers/logger');
const config = require('../../config');


module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      allowNull: false,
      primaryKey: true,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    reset_token_expires_at: {
      type: DataTypes.DATE,
    },
    reset_token: {
      type: DataTypes.STRING,
    },
    verify_token: {
      type: DataTypes.STRING,
      unique: true,
    },
    given_name: {
      type: DataTypes.STRING(35),
      allowNull: false,
    },
    family_name: {
      type: DataTypes.STRING(35),
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    last_locale: {
      type: DataTypes.STRING,
      defaultValue: i18n.config.defaultLocale,
    },
    api_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    group: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    ip: {
      type: DataTypes.STRING,
      validate: {
        isIP: true,
      },
    },
    last_ips: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      validate: {
        isIP: true,
      },
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tosAccepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tosAccepted_date: DataTypes.DATE,
    tosVersion: DataTypes.STRING,
  },
  {
    getterMethods: {
      toObject() {
        return this.toJSON;
      },
      display_name() {
        return `${this.given_name || ''} ${this.family_name || ''}`.trim();
      },
      full_email() {
        return `${this.display_name} <${this.email}>`;
      },
    },
    setterMethods: {
      password(value) {
        // encrypt password
        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(value, salt);
        this.setDataValue('password', password);
      },
    },
  });

  user.addHook('beforeValidate', (cUser, options) => {
    if (!isSANB(cUser.api_token)) cUser.api_token = randomstring.token(24);
    if (!isSANB(cUser.verify_token)) cUser.verify_token = randomstring.token(32);
  });

  user.addHook('afterCreate', async (cUser, options) => {
    try {
      const job = await bull.add('email', {
        template: config.mailjet.templates.verifyMail,
        message: {
          to: cUser.email,
          name: cUser.display_name,
        },
        variables: {
          vorname: cUser.given_name,
          nachname: cUser.given_name,
          confirmation_link: `${config.urls.web}/${cUser.last_locale}/verify-token/${cUser.verify_token}`,
        },
      });
      logger.info('added job', bull.getMeta({ job }));
    } catch (err) {
      logger.error(err);
    }
  });
  user.addHook('afterUpdate', async (cUser, options) => {
    if (cUser.changed('reset_token')) {
      try {
        const job = await bull.add('email', {
          template: config.mailjet.templates.passwordReset,
          message: {
            to: cUser.email,
            name: cUser.display_name,
          },
          variables: {
            vorname: cUser.given_name,
            nachname: cUser.given_name,
            password_link: `${config.urls.web}/${cUser.last_locale}/reset-password/${cUser.reset_token}`,
          },
        });
        logger.info('added job', bull.getMeta({ job }));
      } catch (err) {
        logger.error(err);
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  user.associate = (models) => {
  };
  return user;
};
