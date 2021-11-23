const config = require('../config/yaml.loader');
const constant = require('../util/constant');

const response_handler = (req, res, next) => {
  if (res.path) {
    if (!res.data) {
      res.data = {};
    }

    res.render(res.path, {
      APP_ROOT: global.APP_ROOT,
      SERVER_URL: config.server.url,
      REQUEST_PATH: req.path,
      LOGIN: !!(req.session && req.session[constant.ADMIN_LOGIN_TOKEN]),
      STATIC_URL: config.server.staticUrl,
      UTIL: {
        numberWithCommas: (x) => {
          if (!x) {
            return '0';
          }

          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
      },
      ...res.data,
    });
  } else {
    res.send(res.data);
  }

  next();
};

module.exports = response_handler;
