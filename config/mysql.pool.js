const mysql = require('mysql');
const logger = require('./logger');
const config = require('./yaml.loader');

const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.username,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: config.database.waitForConnections,
  connectionLimit: config.database.connectionLimit,
  charset: 'utf8mb4',
  queryFormat: (query, values) => {
    let queryResult = null;

    if (!values) {
      queryResult = query;
    }

    if (queryResult === 'COMMIT' || queryResult === 'START TRANSACTION') {
      return queryResult;
    }

    if (values) {
      if (Array.isArray(values)) {
        let index = -1;

        queryResult = query.replace(/:\?/g, () => {
          index += 1;
          return pool.escape(values[index]);
        });
      } else {
        // eslint-disable-next-line func-names
        queryResult = query.replace(/:(\w+)/g, (text, key) => {
          let localQuery = '';

          if (Object.prototype.hasOwnProperty.call(values, key) === true) {
            localQuery = pool.escape(values[key]);
          } else {
            localQuery = text;
          }

          return localQuery;
        });
      }
    }

    if (config.database.queryLogging === true) {
      logger.info(`query > ${queryResult}`);
    }

    return queryResult;
  },
});

class MySQLPool {
  constructor() {
    logger.info('new MySQLPool()');
  }

  async beginTransaction() {
    return new Promise((resolve, reject) => {
      pool.getConnection((error, connection) => {
        if (error) {
          return reject(error);
        }

        connection.beginTransaction();

        resolve(connection);
      });
    });
  }

  async query(query, params, connection) {
    return new Promise((resolve, reject) => {
      if (!connection) {
        return reject(new Error('query() > connection is empty '));
      }

      if (!params) {
        params = {};
      }

      connection.query(query, params, (error, rows) => {
        if (error) {
          return reject(error);
        }

        if (Array.isArray(rows) && rows.length === 1 && Object.keys(rows[0]).length === 1) {
          resolve(rows[0]);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async queryOne(query, params) {
    return new Promise((resolve, reject) => {
      pool.getConnection((error, connection) => {
        if (error) {
          return reject(error);
        }

        if (!params) {
          params = {};
        }

        connection.query(query, params, (error2, rows) => {
          if (error2) {
            connection.rollback();
            connection.release();

            return reject(error2);
          }

          connection.release();

          if (Array.isArray(rows) && rows.length === 1 && Object.keys(rows[0]).length === 1) {
            resolve(rows[0]);
          } else {
            resolve(rows);
          }
        });
      });
    });
  }

  async endTransaction(connection) {
    return new Promise((resolve, reject) => {
      if (!connection) {
        return reject(new Error('end_transaction() > connection is empty'));
      }

      connection.commit();
      connection.release();

      resolve(connection);
    });
  }

  async rollback(connection) {
    return new Promise((resolve, reject) => {
      if (!connection) {
        return reject(new Error('rollback() > connection is empty'));
      }

      connection.rollback();
      connection.release();

      resolve(connection);
    });
  }
}

module.exports = new MySQLPool();
