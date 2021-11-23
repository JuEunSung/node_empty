const yaml = require('js-yaml');
const fs = require('fs');

const config = yaml.safeLoad(fs.readFileSync(`${global.APP_ROOT}/config.yaml`, 'utf8'));

module.exports = config;
