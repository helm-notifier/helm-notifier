const passport = require('koa-passport');
const userModel = require('../../models/users.model');
const localStrategy = require('./localstrategy');

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((mail, done) => {
  userModel.get(mail)
    .then((user) => { done(null, user); })
    .catch((err) => {
      done(err, null);
    });
});

localStrategy();
