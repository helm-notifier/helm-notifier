const fs = require('fs');

function getConfig(configName) {
  let configData;
  try {
    configData = fs.readFileSync(`/var/openfaas/secrets/${configName}`, 'utf8');
  } catch (error) {
    if (error.message.includes('no such file or directory')) {
      configData = process.env[configName];
    } else {
      throw error;
    }
  }

  return configData;
}

[].forEach((name) => {
  if (getConfig === undefined) {
    throw new Error(`Config entry for ${name} is missing`);
  }
});

module.exports = getConfig;
