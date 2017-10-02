nodemailer = require('nodemailer');

exports.sendMail = function (opt,res,key) {
   var mailOpts, smtpTransport;

   console.log ('Creating Transport');

   smtpTransport = nodemailer.createTransport('SMTP', {
      service: 'Gmail',
      auth: {
         user: 'www.slava.sn@gmail.com',//config.email,
         pass: '486028863684439Koril'//config.password
      }
});
var subject = 'восстановление пароля'
var body = '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
           '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>' +
           '<p>ссылка для восстановления типа http://localhost:3000/new_pass?key='+key+'</p>';
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

}
