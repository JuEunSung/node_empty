const admin = require('firebase-admin');

const serviceAccount = require('../firebase-adminsdk.json');

class FirebaseUtil {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  async pushMessage(token, title = '', body = '', data = {}) {
    if (!token) {
      return false;
    }

    const message = {
      token,
      notification: {
        title,
        body,
      },
      android: {
        priority: 'high',
      },
      data: {
        data: JSON.stringify(data),
      },
    };

    let response = null;

    try {
      response = await admin.messaging().send(message);
    } catch (error) {
      console.log(error);
      return false;
    }

    if (!response || !response.successCount) {
      return false;
    }

    return true;
  }
}

module.exports = new FirebaseUtil();
