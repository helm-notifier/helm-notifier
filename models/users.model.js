const bcrypt = require('bcryptjs');
const _ = require('lodash');
const knex = require('../db');

const tableName = 'users';
async function create(ctx) {
  const body = _.pick(ctx.request.body, ['firstName', 'lastName', 'password', 'email', 'password']);
  const salt = bcrypt.genSaltSync();
  body.password = bcrypt.hashSync(body.password, salt);

  const dbObj = await knex(tableName)
    .insert(body)
    .returning('*')
    .catch((err) => {
      if (err.code === '23505') {
        const collumn = err.detail.match(/\((.*?)\)/g)[0].replace('(', '').replace(')', '');
        throw new Error(`Duplicate entry for ${collumn}`);
      } else {
        throw err;
      }
    });
  return dbObj[0];
}

async function get(userMail) {
  const dbObj = await knex(tableName)
    .select()
    .where({ email: userMail })
    .first()
    .catch((err) => {
      console.log(err);
      throw err;
    });
  if (dbObj === undefined) {
    throw new Error(`User not found ${userMail}`);
  }
  return dbObj;
}

async function list() {
  const arr = await knex('helm_repos')
    .select();
  return arr;
}
async function getAuthData(email) {
  const dbObj = await knex(tableName)
    .select('email', 'password', 'id')
    .where({ email })
    .first()
    .catch((err) => {
      console.log(err);
      throw err;
    });
  if (dbObj === undefined) {
    throw new Error(`User not found ${email}`);
  }
  return dbObj;
}

module.exports = {
  get,
  create,
  list,
  getAuthData,
};
