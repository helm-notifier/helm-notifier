const Router = require('@koa/router');
const subscriptionsModel = require('../models/subscriptions.model');

const router = new Router();
router.use(async (ctx, next) => {
  if (ctx.isUnauthenticated()) {
    return ctx.redirect('/auth/login');
  }
  return next();
});
// validate that sourceType is of Type chart
router.get('/subscriptions/:source_type/:source_id', async (ctx, next) => {
  try {
    await subscriptionsModel.create(ctx);
  } catch (e) {
    if (!e.message.includes('Duplicate entry for user_id, source_id, source_type')) {
      throw e;
    }
  }
  await ctx.redirect('/repos');
  return next();
});

module.exports = router;
