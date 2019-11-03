const Router = require('@koa/router');
const passport = require('koa-passport');
const userModel = require('../models/users.model');

const router = new Router();

router.get('/auth/login', async (ctx, next) => {
  await ctx.render('auth/login');
  return next();
});

router.post('/auth/login', async (ctx, next) => {
  await passport.authenticate('local', async (err, user) => {
    if (user === false) {
      await ctx.redirect('/auth/login');
      return next();
    }
    await ctx.redirect('/repos');
    await ctx.login(user);
    return next();
  })(ctx);
});

router.get('/auth/logout', (ctx, next) => {
  ctx.logout();
  ctx.redirect('/auth/login');
  return next();
});


router.get('/auth/register', async (ctx, next) => {
  await ctx.render('auth/register');
  return next();
});

/**
 * Todo:
 * [ ] Validate stuff
 * [ ] sanitze stuff
 */
router.post('/auth/register', async (ctx, next) => {
  try {
    await userModel.create(ctx);
    ctx.status = 201;
    await ctx.response.redirect('/auth/login');
  } catch (e) {
    if (e.message.includes('Duplicate entry for email')) {
      await ctx.response.redirect('/auth/register');
    }
  }
  return next();
});

module.exports = router;
