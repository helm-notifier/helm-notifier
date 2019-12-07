const fetch = require('node-fetch');
// const pmaOfferModel = require('../models/pmaOffer.model.js');
const config = require('../config');
// Todo: Make config stuff for this

async function getConfig() {
  return fetch(`${config.urls.pmaBackend}/api/saa/offers/configurations`)
    .then((response) => response.json());
}

async function getOffer(offerId) {
  let offerJson = null;
  const response = await fetch(`${config.urls.pmaBackend}/api/saa/offers/${offerId}`, {
    headers: {
      'API-KEY': config.pmaApiKey,
    },
  });
  if (response.status === 200) {
    offerJson = await response.json();
    offerJson = offerJson.saa_offer;
  }


  return offerJson;
}

module.exports = {
  getConfig,
  getOffer,
};
