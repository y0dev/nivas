const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");

/**
 * Email class to handle email sending functionality
 */
module.exports = class Email {
  /**
   * Constructor to initialize the email object
   * @param {Object} user - The user object containing email and name
   * @param {string} url - The URL to be included in the email
   */
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Urban Insight Inc. <${process.env.EMAIL_FROM}>`;
  }

  /**
   * Creates a nodemailer transport object based on environment
   * @returns {Object} - Nodemailer transport object
   */
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // SendGrid Transport for production
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // Development Transport
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Sends an email using the specified template and subject
   * @param {string} template - The email template to use
   * @param {string} subject - The subject of the email
   */
  async send(template, subject) {
    // Render HTML based on the template
    const html = pug.renderFile(
      `${__dirname}/../../views/email/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // Email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText(html),
    };

    // Send email
    await this.newTransport().sendMail(mailOptions);
  }

  /**
   * Sends a welcome email
   */
  async sendWelcome() {
    await this.send("welcome", "Welcome to Urban Insight Inc!");
  }

  /**
   * Sends a password reset email
   */
  async sendPasswordReset() {
    await this.send("passwordReset", "Your password reset token");
  }

  /**
   * Sends a contact email response
   */
  async sendContactEmail() {
    await this.send("contact_email", "Someone will reach out to you shortly.");
  }
};
