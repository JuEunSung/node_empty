const responseStatus = require('../config/response.status');
const config = require('../config/yaml.loader');

const { ADMIN_LOGIN_TOKEN } = require('../util/constant');

class WEBSysController {
  constructor() {
    console.log('new WEBSysController()');
  }

  async home(req, res, next) {
    try {
      res.data = {
        bar: 'foo',
      };
      res.path = 'home/index';
      next();
    } catch (error) {
      next(error);
    }
  }

  login(req, res, next) {
    try {
      const params = req.body;

      if (!params.id || !params.pw) {
        throw new Error(responseStatus.BAD_REQUEST.message);
      }

      if (params.id === config.client.adminID && params.pw === config.client.adminPW) {
        req.session[ADMIN_LOGIN_TOKEN] = params.id;
        res.data = responseStatus.OK.message;
      } else {
        res.data = responseStatus.FORBIDDEN.message;
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  logout(req, res, next) {
    try {
      req.session.destroy(() => {
        if (req.session && req.session[ADMIN_LOGIN_TOKEN]) {
          // eslint-disable-next-line no-unused-expressions
          req.session[ADMIN_LOGIN_TOKEN];
        }
      });

      res.data = responseStatus.OK.message;

      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WEBSysController();
