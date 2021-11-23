const responseStatus = require('../../config/response.status');
const service = require('./service');

const { DEFAULT_PAGING_LIMIT } = require('../../util/constant');

class ArticleController {
  constructor() {
    console.log('new ArticleController()');
  }

  async getArticleList(req, res, next) {
    try {
      const params = req.query;
      params.m_no = params.m_no || 0;
      params.profile = params.profile || 0;
      params.keyword = params.keyword || '';
      params.s_code = params.s_code || 0;
      params.rowPerPage = Number(params.rowPerPage) || DEFAULT_PAGING_LIMIT;
      params.page = Number(params.page) || 1;
      params.startRow = (params.page - 1) * params.rowPerPage;

      const count = await service.getArticleListCount(params);
      const list = await service.getArticleList(params);

      res.data = {
        count,
        list,
      };
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ArticleController();
