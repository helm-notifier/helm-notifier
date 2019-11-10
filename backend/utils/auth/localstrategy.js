const LocalStrategy = require('passport-local').Strategy;
const passport = require('koa-passport');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const userModel = require('../../models/users.model');

function comparePass(password, dbPassword) {
  return bcrypt.compareSync(password, dbPassword);
}

module.exports = () => {
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    userModel.get(email)
      .then((user) => {
        if (!comparePass(password, user.password)) {
          return done(null, false);
        }
        const userObj = _.omit(user, ['password', 'id']);
        return done(null, userObj);
      })
      .catch((err) => done(err));
  }));
};
