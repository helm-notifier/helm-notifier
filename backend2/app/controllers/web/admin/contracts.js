const { Contract, PmaOffer, User } = require('../../../models');
const { pma } = require('../../../../helpers');

async function dashboard(ctx) {
  ctx.state.contracts = await Contract.findAll({include: [ PmaOffer, User ],where: {offerState: "ordered"}});
  ctx.state.PmaConfig = await pma.getConfig();

  return ctx.render('admin')
}
async function contractView(ctx) {
  ctx.state.contract = await Contract.findOne({include: [ PmaOffer, User ],where: {id: ctx.params.id}});
  return ctx.render('admin/contract');
}
async function activateContract(ctx) {

}
module.exports = {dashboard, contractView};
