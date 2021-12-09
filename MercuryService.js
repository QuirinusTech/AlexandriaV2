var nodemailer = require('nodemailer');

module.exports = {
  NotificationUpdateEmail: async function NotificationUpdateEmail(notificationsList) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'quirinus.mercury.service@gmail.com',
        pass: process.env.mercuryServiceAppPassword
      }
    });
    
    let htmlstring = `<div><table style="background-color:#23232e;color:white;border-collapse: collapse; width:450px;margin:0;text-align: center;"><thead><tr style="height:40px;margin:0;border: 1px solid wheat;background-color:#23232e;color:white;"><th style="margin:0;">Type</th><th style="margin:0;">Update</th><th style="margin:0;">Affected Entry</th></tr></thead><tbody>`
    notificationsList.forEach(msg => {
      let thisstring = `<tr style="height:40px; margin:0;border: 1px solid wheat;background-color:#23232e;color:white;"><td style="margin:0;">${msg['msgType']}</td><td style="margin:0;">${msg['msgContent']}</td><td style="margin:0;">${msg['affectedEntry']}</td></tr>`
      htmlstring += thisstring
    });
    htmlstring += "</tbody></table></div>"
  
    var mailOptions = {
      from: 'quirinus.mercury.service@gmail.com',
      to: 'quirinustech@gmail.com',
      subject: 'Notification update - Alexandria V2',
      text: JSON.stringify(notificationsList),
      html: htmlstring,
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
  passwordResetMail: async function passwordResetMail(validationCode, username, email) {

    return new Promise((resolve, reject) => {

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'quirinus.mercury.service@gmail.com',
        pass: process.env.mercuryServiceAppPassword
      }
    });

    let htmlstring = `<div><div><img src="cid:quirinusLogo"/></div><p>You requested a password reset.</p><p>To reset your password, please use the following link:</p><p>`
    htmlstring += `<a href="https://alexandriav2.herokuapp.com/#/passwordReset/${username}/${validationCode}">Reset Password.</a></p>`
    htmlstring += "<p>If this doesn't work please visit https://alexandriav2.herokuapp.com/#/passwordReset/ and enter your username and validation code manually.</p>"
    htmlstring += "<p>Your username is: <b>" + username + "</b></p>"
    htmlstring += "<p>Your code is: <b>" + validationCode + "</b></p></div>"

    let textmessage = `Please visit https://alexandriav2.herokuapp.com/#/passwordReset/ and enter your username (${username}) and validation code (${validationCode}).`

    var mailOptions = {
      from: 'quirinus.mercury.service@gmail.com',
      to: email,
      subject: 'Notification update - Alexandria V2',
      text: textmessage,
      html: htmlstring,
      attachments: [{
        filename: 'QuirinusTech.png',
        path: '/client/public/img/QuirinusTech.png',
        cid: 'quirinusLogo' //same cid value as in the html img src
    }]
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        resolve(false)
      } else {
        console.log('Email sent: ' + info.response);
        resolve(true)
      }
    });

    })
  }
}