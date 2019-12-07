const util = require('util');
const {expect} = require('chai');
require('../global');
const phrases = require('../../config/phrases');
const {User, Contract} = require('../../app/models');

const wait = ms => new Promise(r => setTimeout(r, ms));

const retryOperation = (operation, delay, times) => new Promise((resolve, reject) => {
  return operation()
    .then(resolve)
    .catch((reason) => {
      if (times - 1 > 0) {
        return wait(delay)
          .then(retryOperation.bind(null, operation, delay, times - 1))
          .then(resolve)
          .catch(reject);
      }
      return reject(reason);
    });
});

function parseCookies(response) {
  const raw = response.headers.raw()['set-cookie'];
  return raw.map((entry) => {
    const parts = entry.split(';');
    const cookiePart = parts[0];
    return cookiePart;
  }).join(';');
}
function getOffer() {
  return fetch("https://api.pma.prezero.dev/api/saa/offers", {
    "credentials": "include",
    "headers": {
      "content-type": "application/json",
    },
    "body": JSON.stringify({
      configuration: {
        container_id: 1,
        waste_id: 1,
        count: 1,
        pick_up: 1,
        week: '2019-48',
        location: {
          lat: 52.55459999999999,
          lng: 13.166780000000017,
          formatted_address: 'Wasserwerkstraße 30, 13589 Berlin, Deutschland',
          country: 'Deutschland',
          country_code: 'DE',
          city: 'Berlin',
          street: 'Wasserwerkstraße',
          house_number: '30',
          zip: '13589'
        }
      }
    }),
    "method": "POST",
  }).then(res => res.json());
}

describe('pma flow', () => {
  before(async () => {
    await retryOperation(() => global.web.get('/'), 1000, 5);
    await User.destroy({
      where: {},
      force: true,
      truncate: {cascade: true},
    })
  });
  it('register with contractId', async () => {
    const offer = await getOffer();
    console.log(offer);
    const res = await global.web.post('/en/register', {
      body: {
        email: 'test@example.com',
        password: '@!#SAL:DMA:SKLM!@',
        offerId: offer.saa_offer.id
      }
    });
    const contract = await Contract.findOne({where: {PmaOfferId: offer.saa_offer.id}});
    const pmaOffer = await contract.getPmaOffer();
    expect(contract.offerState).to.eq('created');
    expect(pmaOffer.id).to.eq(offer.saa_offer.id);
  });
  it('redirect with from PriceConfigurator when loggedin', async () => {
    const offer = await getOffer();
    console.log(offer);
    const res = await global.web.post('/en/register', {
      body: {
        email: 'test2@example.com',
        password: '@!#SAL:DMA:SKLM!@',
      }
    });
    const parsedCookies = parseCookies(res);
    const res2 = await global.web.post('/wcendpoint', {
      'headers': {
        'accept': '*/*',
        'cookie': parsedCookies,
      },
      body: {
        pma_price_id: offer.saa_offer.id,
      }
    });
    expect(res2.url).to.contains('/en/dashboard');
    const contract = await Contract.findOne({where: {PmaOfferId: offer.saa_offer.id}});
    const res3 = await global.web.get(`/en/contract/order/${contract.id}`, {
      'headers': {
        'accept': '*/*',
        'cookie': parsedCookies,
      }
    });
  });
});
