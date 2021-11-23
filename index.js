global.APP_ROOT = __dirname;

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');

const config = require('./config/yaml.loader');
const constant = require('./util/constant');

if (!config.server.logging) {
  console.log = () => {};
}

const logger = require('./config/logger');
require('./config/mysql.pool');
const adminRoutes = require('./admin/routes');
const apiRoutes = require('./api/routes');
require('./config/scheduler');
const responseHandler = require('./middleware/response.handler');
const errorHandler = require('./middleware/error.handler');

const app = express();

/**
 * Template engine 적용
 */
app.set('views', `${global.APP_ROOT}/views`);
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

/**
 * Body Parser 적용
 */
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
    'Content-Type': 'UTF-8',
  }),
);
app.use(
  session({
    secret: config.encrypt.SESSIONKey,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: constant.ADMIN_LOGIN_TERM },
  }),
);

/**
 * Static Resource 적용
 */
app.use('/static', express.static(`${global.APP_ROOT}/assets`));

/**
 * Middlewarte & Router 적용
 */
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);
app.use(responseHandler);
app.use(errorHandler);

app.listen(config.server.port, '0.0.0.0', () => {
  logger.info(`${config.server.name} server is running ... (${config.server.port})`);
});

module.exports = app;
