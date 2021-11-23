const config = require('../config/yaml.loader');
const errorStatus = require('../config/error.status');
const responseStatus = require('../config/response.status');

const constant = require('../util/constant');

module.exports = (error, req, res, next) => {
  if (config.server.errorLogging) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  const errorId = error.message;
  let response = null;
  let redirect = '';

  if (Object.prototype.hasOwnProperty.call(errorStatus, errorId)) {
    // is custom error
    response = errorStatus[errorId];
  } else if (Object.prototype.hasOwnProperty.call(responseStatus, errorId)) {
    // is managing error
    response = responseStatus[errorId];

    if (errorId === responseStatus.UNAUTHORIZED.id && req.originalUrl.startsWith('/admin')) {
      redirect = 'login/index';
    }
  } else {
    // is unexpected error
    response = responseStatus.SERVER_ERROR;

    if (req.originalUrl.startsWith('/admin')) {
      redirect = 'login/index';
    }
  }

  if (redirect) {
    res.render(redirect, {
      APP_ROOT: global.APP_ROOT,
      REQUEST_PATH: req.path,
      LOGIN: !!(req.session && req.session[constant.ADMIN_LOGIN_TOKEN]),
    });
  } else {
    res.status(response.code).send(response);
    next();
  }
};
