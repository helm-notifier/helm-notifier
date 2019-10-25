const LocalStrategy = require('passport-local').Strategy;
const passport = require('koa-passport');
const bcrypt = require('bcryptjs');
const userModel = require('../../models/users.model');

function comparePass(password, dbPassword) {
  return bcrypt.compareSync(password, dbPassword);
}

module.exports = () => {
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    userModel.getAuthData(email)
      .then((user) => {
        if (!comparePass(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  }));
};
