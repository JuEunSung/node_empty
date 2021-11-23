const fs = require('fs');
const multer = require('multer');

const config = require('../config/yaml.loader');
const crypto = require('../util/crypto.util');

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let basePath = config.server.uploadBasePath;

      if (req.baseUrl.startsWith('/api')) {
        basePath += '/users';
      } else if (req.baseUrl.startsWith('/admin')) {
        basePath += '/sys';
      }

      console.log(basePath);

      if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
      }

      callback(null, basePath);
    },
    filename: (req, file, callback) => {
      const extension_index = file.originalname.lastIndexOf('.');
      let extension = '';

      if (extension_index > -1) {
        extension = file.originalname.substring(extension_index + 1);
      }

      callback(null, `${crypto.getGUID()}${extension_index > -1 ? `.${extension}` : ''}`);
    },
  }),
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
  onError: (error, next) => {
    next(error);
  },
}).array('file', 5);
