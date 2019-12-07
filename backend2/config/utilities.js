const _ = require('lodash');
const accounting = require('accounting');
const boolean = require('boolean');
const customFonts = require('custom-fonts-in-emails');
const dashify = require('dashify');
const fa = require('font-awesome-assets');
const gemoji = require('gemoji');
const hljs = require('highlight.js');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const moment = require('moment');
const pluralize = require('pluralize');
const titleize = require('titleize');

function json(str, replacer = null, space = 2) {
  return JSON.stringify(str, replacer, space);
}

function emoji(str) {
  return gemoji.name[str] ? gemoji.name[str].emoji : '';
}

function formatEuro (number) {
  return (Number.parseFloat(number || 0).toFixed(2) + ' €').replace(/\./, ",");
}

const validateSteuerNummer = new RegExp(/([0-9]{2,3}\/?[0-9]{3,4}\/?[0-9]{4,5})|([1-59][0-9]{12})/);

module.exports = {
  hljs,
  _,
  isSANB,
  moment,
  accounting,
  fa,
  pluralize,
  json,
  emoji,
  validateSteuerNummer,
  boolean,
  titleize,
  dashify,
  humanize,
  formatEuro,
  ...customFonts
};
