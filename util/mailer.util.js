const mailer = require('nodemailer');
const config = require('../config/yaml.loader');

class MailerUtil {
  constructor() {
    this.transporter = mailer.createTransport({
      service: config.mail.service,
      auth: {
        user: config.mail.id,
        pass: config.mail.pw,
      },
    });
  }

  send(receiver, title, content) {
    const option = {
      from: `"${config.server.service}" <${config.mail.id}>`,
      to: receiver,
      subject: title,
      html: content,
    };

    const promise = new Promise((resolve, reject) => {
      this.transporter.sendMail(option, (error, info) => {
        if (error) {
          reject(error);
        }
        resolve(info);
      });
    });

    return promise;
  }
}

module.exports = new MailerUtil();
