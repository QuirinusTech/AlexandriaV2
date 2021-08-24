var nodemailer = require('nodemailer');

module.exports = {
  NotificationUpdateEmail: function NotificationUpdateEmail(notificationsList) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'quirinus.mercury.service@gmail.com',
        pass: process.env.mercuryServiceAppPassword
      }
    });
    
    let htmlstring = "<div><table><thead><tr><th>Creator</th><th>Entry</th><th>Update</th></tr></thead><tbody>"
    notificationsList.forEach(element => {
      let thisstring = `<tr><td>${element['username']}</td><td>${element['item']}</td><td>${element['update']}</td></tr>`
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
  }
}