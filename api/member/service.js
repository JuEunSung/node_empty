const config = require('../../config/yaml.loader');
const mysql = require('../../config/mysql.pool');

const query = require('./query');

class MemberService {
  async getMemberProfile(params) {
    params.STATIC_URL = config.server.staticUrl;

    const selectMemberProfile = query.selectMemberProfile();
    // const member = (await mysql.queryOne(selectMemberProfile, params))[0];

    return {
      m_no: 1,
      m_name: '홍길동',
      m_age: 30,
      m_gender: 'M',
      m_phone: '010-4535-0989',
    };
  }
}

module.exports = new MemberService();
