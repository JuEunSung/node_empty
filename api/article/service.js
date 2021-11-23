const config = require('../../config/yaml.loader');
const mysql = require('../../config/mysql.pool');

const query = require('./query');

class ArticleService {
  async getArticleListCount(params) {
    const selectArticleListCount = query.selectArticleListCount(params);
    // const count = (await mysql.queryOne(selectArticleListCount, params)).count;

    return 1;
  }

  async getArticleList(params) {
    params.STATIC_URL = config.server.staticUrl;

    const selectArticleList = query.selectArticleList(params);
    // const list = await mysql.queryOne(selectArticleList, params);

    return [
      {
        a_no: 1,
        a_title: '제목',
        a_content: '내용',
        a_reg_dt: '2021-11-01 21:33:11',
      },
    ];
  }
}

module.exports = new ArticleService();
