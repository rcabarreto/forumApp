'use strict';

let nodemailer = require('nodemailer');
let mlhbs = require('nodemailer-express-handlebars');
let env = process.env.NODE_ENV || 'development';

let hbsConfig = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: 'views/email/',
    defaultLayout : 'layout',
    partialsDir : 'views/email/partials/'
  },
  viewPath: 'views/email/',
  extName: '.hbs'
};

let smtpTransportConfig;
let mailConfig;

if (env === 'development') {
  smtpTransportConfig = {
    service: "Mailhog",
    host: "localhost",
    port: 1025,
    secure: false
  };

  mailConfig = {
    from: 'email@gmail.com'
  };

} else {
  smtpTransportConfig = {
    service: "Gmail",
    host: "smtp.gmail.com",
    auth: {
      user: 'email@gmail.com',
      pass: ''
    }
  };

  mailConfig = {
    from: 'email@gmail.com'
  };

}


let smtpTransport = nodemailer.createTransport(smtpTransportConfig, mailConfig);
smtpTransport.use('compile', mlhbs(hbsConfig));

let mailer = {};

mailer.smtpTransport = smtpTransport;

mailer.sendEmail = function () {

  let message = {
    to: 'forumapptest@mailinator.com',
    subject: 'Message title',
    template: 'email_teste',
    context: {
      variable1 : 'Rodrigo',
      variable2 : 'Barreto'
    }
  };

  let mailOptions = {
    to: 'forumapptest@mailinator.com',
    subject: 'teste',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>'
  };

  console.log('THIS IS THE API HIT: ' + 'Email to: ' + mailOptions.to + 'Subject: ' + mailOptions.subject + 'Message: ' + mailOptions.text);

  smtpTransport.sendMail(message, function (error, response) {
    if (error) {
      console.log(error);
      res.json({error: "API Error"});
    } else {
      console.log("Message sent: " + response.message);
      res.json({ response: "sent" });
    }
  });

};

module.exports = mailer;

