const { Contract } = require('../../models');
const Boom = require('@hapi/boom');
const config = require('../../../config');

async function orderContract(ctx) {
  const contract = await Contract.findByPk(ctx.params.offerId);
  const belongsToUser = contract.UserId === ctx.state.user.id;
  if(!belongsToUser) {
    return ctx.throw(
      Boom.unauthorized(
        ctx.translate
          ? ctx.translate('IS_NOT_ADMIN')
          : 'You do not belong to the administrative user group.'
      )
    );
  }
  contract.offerState = 'ordered';
  contract.orderedOn = new Date();
  await contract.save();
  let redirectTo = `/${ctx.locale}${config.passportCallbackOptions.successReturnToOrRedirect}`;

  if (ctx.session && ctx.session.returnTo) {
    redirectTo = ctx.session.returnTo;
    delete ctx.session.returnTo;
  }
  // Todo Case estimated or not
  ctx.flash('custom', {
    title: "Bestellungs update",
    text: "Ihre Anfrage wurde erfolgreich übermittelt. Ein Mitarbeiter wird Sie mit einem verbindlichen Angebot kontaktieren.",
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('json')) {
    ctx.body = {redirectTo};
  } else {
    ctx.redirect(redirectTo);
  }
}

async function cancelContract(ctx) {
  const contract = await Contract.findByPk(ctx.params.offerId);
  const belongsToUser = contract.UserId === ctx.state.user.id;
  if(!belongsToUser) {
    return ctx.throw(
      Boom.unauthorized(
        ctx.translate
          ? ctx.translate('IS_NOT_ADMIN')
          : 'You do not belong to the administrative user group.'
      )
    );
  }
  await contract.destroy();
  let redirectTo = `/${ctx.locale}${config.passportCallbackOptions.successReturnToOrRedirect}`;

  if (ctx.session && ctx.session.returnTo) {
    redirectTo = ctx.session.returnTo;
    delete ctx.session.returnTo;
  }
  // Todo Case estimated or not
  ctx.flash('custom', {
    title: "Bestellungs update",
    text: "Angebot wurde gelöscht.",
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('json')) {
    ctx.body = {redirectTo};
  } else {
    ctx.redirect(redirectTo);
  }
}

module.exports = {
  orderContract,
  cancelContract,
};
