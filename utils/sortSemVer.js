const compareVersions = require('compare-versions');

function fixVersion(chartVersion) {
  let correctedVersion = chartVersion;
  if (correctedVersion.includes('_') === true) {
    correctedVersion = correctedVersion.replace('_', '-');
  } else if ((correctedVersion.match(/\./g) || []).length === 1) {
    let rest = [];
    if (correctedVersion.includes('-')) {
      [correctedVersion, ...rest] = correctedVersion.split('-');
    }
    correctedVersion = `${correctedVersion}.0`;
    if (rest.length !== 0) {
      correctedVersion = `${correctedVersion}-${rest.join('-')}`;
    }
  } else if (correctedVersion === '0.1.5a') {
    correctedVersion = '0.1.5-a';
  }
  return correctedVersion;
}

function semVerSort(a, b) {
  return compareVersions(fixVersion(a.version), fixVersion(b.version));
}

module.exports = semVerSort;
