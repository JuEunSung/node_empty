const responseStatus = require('../../config/response.status');

const service = require('./service');

class MemberController {
  constructor() {
    console.log('new MemberController()');
  }

  async getMemberProfile(req, res, next) {
    try {
      const params = req.query;
      params.m_no = params.m_no || 0;

      if (!params.profile) {
        throw new Error(responseStatus.BAD_REQUEST.message);
      }

      const member = await service.getMemberProfile(params);

      res.data = member;
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MemberController();
