const Router = require('express');

const member = require('./member/router');
const article = require('./article/router');

const router = Router();

router.use('/member', member);
router.use('/article', article);

module.exports = router;
