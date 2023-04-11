const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendContactEmail = (req, res, next) => {
  req.params.id = req.user.id;

  //   const msg = {
  //     to: "recipient@example.com",
  //     from: "sender@example.com",
  //     subject: "Test Email",
  //     text: "This is a test email sent using SendGrid.",
  //     html: "<strong>This is a test email sent using SendGrid.</strong>",
  //   };

  //   sgMail
  //     .send(msg)
  //     .then(() => {
  //       console.log("Email sent");
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });

  next();
};
