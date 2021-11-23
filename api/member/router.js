const Router = require('express');

const noAuthHandler = require('../../middleware/noauth.handler');
const controller = require('./controller');

const router = Router();

router.get('/profile', noAuthHandler, controller.getMemberProfile);

module.exports = router;
