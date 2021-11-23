const mysql = require('../config/mysql.pool');
const crypto = require('../util/crypto.util');

module.exports = async (req, res, next) => {
  // JWT Verify
  const token = req.headers['x-access-token'] || req.body.token;

  delete req.query.m_no;
  delete req.body.m_no;

  if (token) {
    try {
      const encryptedId = crypto.verify(token);

      if (encryptedId) {
        const decryptedId = crypto.decryptAES256(encryptedId);
        const selectNoById = 'SELECT m_no FROM tbl_member WHERE m_id = :m_id';

        const { m_no } = await mysql.queryOne(selectNoById, { m_id: decryptedId });

        req.query.m_no = m_no;
        req.body.m_no = m_no;
      }
    } catch (error) {
      next(error);
    }
  }

  next();
};
