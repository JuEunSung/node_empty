const Router = require('express');
const controller = require('./controller');

const noAuthHandler = require('../../middleware/noauth.handler');

const router = Router();

router.get('/', noAuthHandler, controller.getArticleList);

module.exports = router;
