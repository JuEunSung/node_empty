const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const config = require('../config/yaml.loader');
const responseStatus = require('../config/response.status');

class CryptoUtil {
  constructor() {
    this.byteSize = 64;
    this.hashingCount = 121301;
  }

  sign(key) {
    if (!isNaN(key)) {
      key = String(key);
    }

    const encryptedKey = this.encryptAES256(key);
    const token = jwt.sign(
      {
        key: encryptedKey,
      },
      config.encrypt.JWTKey,
      {
        expiresIn: config.encrypt.expiresIn,
        issuer: config.server.domain,
        subject: 'GAA_MEMBER',
      },
    );

    return token;
  }

  verify(token) {
    try {
      const payload = jwt.verify(token, config.encrypt.JWTKey);
      let encryptedKey = null;

      if (payload) {
        encryptedKey = this.decryptAES256(payload.key);
      }

      return encryptedKey;
    } catch (error) {
      throw new Error(responseStatus.FORBIDDEN.message);
    }
  }

  sha512(message) {
    const buffer = crypto.randomBytes(64);
    const key = crypto.pbkdf2Sync(message, buffer.toString('base64'), this.hashingCount, this.byteSize, 'sha512');

    const data = key.toString('base64');
    const salt = buffer.toString('base64');

    return {
      data,
      salt,
    };
  }

  sha512WithSalt(message, salt) {
    const data = crypto.pbkdf2Sync(message, salt, this.hashingCount, this.byteSize, 'sha512');

    return {
      data: data.toString('base64'),
      salt,
    };
  }

  encryptAES256(str, key = config.encrypt.AESKey) {
    if (!isNaN(str)) {
      str = String(str);
    }

    const cipher = crypto.createCipher('aes-256-cbc', key);
    let result = cipher.update(str, 'utf8', 'base64');
    result += cipher.final('base64');

    return result;
  }

  decryptAES256(str, key = config.encrypt.AESKey) {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let result = decipher.update(str, 'base64', 'utf8');
    result += decipher.final('utf8');

    return result;
  }

  getGUID() {
    const s4 = () => {
      const random = Math.floor((1 + Math.random()) * 0x10000);
      return random.toString(16).substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }
}

module.exports = new CryptoUtil();
