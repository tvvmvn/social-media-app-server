var nodemailer = require('nodemailer');

exports.sendEmail = (email, link) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  });

  var mailOptions = {
    from: 'tvvmvn@gmail.com',
    to: email,
    subject: 'email verification',
    text: link
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
