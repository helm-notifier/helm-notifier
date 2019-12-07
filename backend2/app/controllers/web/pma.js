const { Contract } = require('../../models');
const config = require('../../../config');

async function redirectToRegister(ctx) {
  return ctx.redirect(
    `/${ctx.locale}/register?offerId=${ctx.request.body.pma_price_id}`,
  );
}
async function addOffer(ctx, next) {
  if (ctx.isAuthenticated()) {
    await Contract.create({
      PmaOfferId: ctx.request.query.offerId,
      UserId: ctx.state.user.id,
    });
    return ctx.redirect(
      '/dashboard',
    );
  }
  return next();
}
module.exports = {
  redirectToRegister,
  addOffer,
};
