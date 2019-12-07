const passport = require('koa-passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const phrases = require('../config/phrases');
const config = require('../config');
const { User } = require('../app/models');

function comparePass(password, dbPassword) {
  return bcrypt.compareSync(password, dbPassword);
}

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    // if no user exists then invalidate the previous session
    // <https://github.com/jaredhanson/passport/issues/6#issuecomment-4857287>
    if (!user) return done(null, false);
    // otherwise continue along
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use('local', new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ where: { email } })
    .then((user) => {
      if (user === null) {
        return done(new Error(phrases.PASSPORT_INCORRECT_USERNAME_ERROR), false);
      }
      if (!comparePass(password, user.password)) {
        return done(new Error(phrases.PASSPORT_INCORRECT_USERNAME_ERROR), false);
      }
      return done(null, user);
    })
    .catch((err) => done(err));
}));

module.exports = passport;
