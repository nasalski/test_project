nodemailer = require('nodemailer');

exports.sendMail = function (opt,res,key,email) {
   var mailOpts, smtpTransport;

   console.log ('Creating Transport');

   smtpTransport = nodemailer.createTransport('SMTP', {
      service: 'Gmail',
      auth: {
         user: 'www.slava.sn@gmail.com',//config.email,
         pass: '486028863684439Koril'//config.password
      }
});
var subject = 'восстановление пароля';
var body = '<p><b>Hello!</b></p>' +
           '<p>You received this email because user '+ email + ' wants to reset the password :</p>' +
           '<p>http://localhost:3000/new_pass?key='+key+'</p>'+
'Regards,Administration of the project "Thunderbolt"';

// параметры отправки
mailOpts = {
   from: opts.from,
   replyTo: opts.from,
   to: opts.to,
   subject: subject,
   html: body
};

console.log('mailOpts: ', mailOpts);

console.log('Sending Mail');
// Отправка сообщения
smtpTransport.sendMail(mailOpts, function (error, response) {
   if (error) {
      console.log(error);
   }else {
      res.sendStatus(200);
      console.log('Message sent: ' + response.message);
   }
   console.log('Closing Transport');
   smtpTransport.close();
   });

};
