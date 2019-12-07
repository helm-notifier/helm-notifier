const paginate = require('koa-ctx-paginate');

const {User} = require('../../../models');
const config = require('../../../../config');

async function list(ctx) {
  const [users, itemCount] = await Promise.all([
    User.findAll({
      offset: ctx.paginate.skip,
      limit: ctx.query.limit,
      order: [['createdAt', 'DESC']],

    }),
    User.count()
  ]);

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  await ctx.render('admin/users', {
    users,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
  });
}

async function retrieve(ctx) {
  ctx.state.result = await User.findOne({where: {id: ctx.params.id}});
  if (!ctx.state.result) throw new Error(ctx.translate('INVALID_USER'));
  await ctx.render('admin/users/retrieve');
}

async function update(ctx) {
  const user = await User.findOne({where: {id: ctx.params.id}});
  if (!user) throw new Error(ctx.translate('INVALID_USER'));
  const {body} = ctx.request;

  user[config.passport.fields.givenName] =
    body[config.passport.fields.givenName];
  user[config.passport.fields.familyName] =
    body[config.passport.fields.familyName];
  user.email = body.email;
  user.group = body.group;

  await user.save();

  if (user.id === ctx.state.user.id) await ctx.login(user);

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

async function remove(ctx) {
  const user = await User.findOne({where: {id: ctx.params.id}});
  if (!user) throw new Error(ctx.translate('INVALID_USER'));
  await user.destroy();
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

async function login(ctx) {
  const user = await User.findOne({where: {id: ctx.params.id}});
  if (!user) throw new Error(ctx.translate('INVALID_USER'));

  ctx.logout();

  await ctx.login(user);

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
    ctx.body = {redirectTo: '/'};
  } else {
    ctx.redirect('/');
  }
}

module.exports = {list, retrieve, update, remove, login};
