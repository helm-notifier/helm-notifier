const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const Boom = require('@hapi/boom');
const render = require('koa-views-render');
const {PmaOffer} = require('../../models');
const config = require('../../../config');
const {pma} = require('../../../helpers');

async function update(ctx) {
  const {body} = ctx.request;

  if (body.change_password === 'true') {
    ['old_password', 'password', 'confirm_password'].forEach(prop => {
      if (!isSANB(body[prop]))
        throw Boom.badRequest(
          ctx.translate('INVALID_STRING', ctx.request.t(humanize(prop)))
        );
    });

    if (body.password !== body.confirm_password)
      throw Boom.badRequest(ctx.translate('INVALID_PASSWORD_CONFIRM'));

    await ctx.state.user.changePassword(body.old_password, body.password);
    ctx.state.user.reset_token = null;
    ctx.state.user.reset_at = null;
  } else {
    ctx.state.user[config.passport.fields.givenName] =
      body[config.passport.fields.givenName];
    ctx.state.user[config.passport.fields.familyName] =
      body[config.passport.fields.familyName];
    ctx.state.user.phoneNumber = body.phoneNumber;
    ctx.state.user.companyName = body.companyName;
    ctx.state.user.companyStreet = body.companyStreet;
    ctx.state.user.companyHouseNumber = body.companyHouseNumber;
    ctx.state.user.companyZip = body.companyZip;
    ctx.state.user.companyCity = body.companyCity;
    ctx.state.user.payAccountHolder = body.payAccountHolder;
    ctx.state.user.payIban = body.payIban;
    ctx.state.user.payBic = body.payBic;
    ctx.state.user.payInstitute = body.payInstitute;
    ctx.state.user.payVatId = body.payVatId;
    ctx.state.user.payByInvoice = body.payByInvoice;
    ctx.state.user.eInvoice = body.eInvoice;
  }
  try {
    await ctx.state.user.save();
  } catch (e) {
    throw Boom.badRequest(
      e.message
    );
  }


  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('json')) {
    ctx.body = {reloadPage: true};
  } else {
    ctx.redirect('back');
  }
}

async function resetAPIToken(ctx) {
  ctx.state.user.api_token = null;
  await ctx.state.user.save();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('json')) {
    ctx.body = {reloadPage: true};
  } else {
    ctx.redirect('back');
  }
}

async function dashboard(ctx) {
  ctx.state.contracts = await ctx.state.user.getContracts({
    include: [{model: PmaOffer}]
  });
  ctx.state.PmaConfig = await pma.getConfig();
  return ctx.render('dashboard')
}

module.exports = {
  dashboard,
  update,
  resetAPIToken
};
