const Router = require('express');
const authHandler = require('../middleware/auth.handler');

const sys = require('./WEBSysController');

const router = Router();

router.get('/', authHandler, sys.home);

router.post('/login', sys.login);
router.post('/logout', sys.logout);

module.exports = router;
