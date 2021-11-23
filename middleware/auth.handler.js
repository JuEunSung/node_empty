const mysql = require('../config/mysql.pool');
const responseStatus = require('../config/response.status');

const crypto = require('../util/crypto.util');
const constant = require('../util/constant');

module.exports = async (req, res, next) => {
  // JWT Verify
  let token = req.headers['x-access-token'] || req.body.token;
  let isWEB = false;

  if (req.baseUrl.startsWith('/admin')) {
    token = req.session[constant.ADMIN_LOGIN_TOKEN];
    isWEB = true;
  }

  if (!isWEB && (!token || Object.hasOwnProperty.call(req.query, 'm_no') || Object.hasOwnProperty.call(req.body, 'm_no'))) {
    return next(new Error(responseStatus.UNAUTHORIZED.id));
  }

  if (isWEB) {
    if (!token) {
      return next(new Error(responseStatus.UNAUTHORIZED.id));
    }

    next();
    return;
  }

  try {
    const encryptedId = crypto.verify(token);

    if (encryptedId) {
      const decryptedId = crypto.decryptAES256(encryptedId);
      const selectNoById = 'SELECT m_no FROM tbl_member WHERE m_id = :m_id';

      const { m_no } = await mysql.queryOne(selectNoById, { m_id: decryptedId });

      req.query.m_no = m_no;
      req.body.m_no = m_no;
      req.m_no = m_no;
    }
  } catch (error) {
    next(error);
  }

  next();
};
