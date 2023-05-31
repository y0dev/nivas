const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split("")[0];
    this.url = url;
    this.from = `Urban Insight Inc. <${process.env.EMAIL_FROM}>`;
  }

  // constructor() {
  //   this.from = `Urban Insight Inc. <${process.env.EMAIL_FROM}>`;
  // }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createToken({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../../views/email/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText(html),
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to Urban Insight Inc!");
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Your password reset token");
  }

  async sendContactEmail() {
    await this.send("contact_email", "Someone will reach out to you shortly.");
  }
};

// create a transporter
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
// activate in gmail "less secure app" option
//   });
