import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import { IUser } from '../user/user.schema';

export default class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private from: string;

  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.firstName = user.name.split('')[0];
    this.url = url;
    this.from = `Urban Insight Inc. <${process.env.EMAIL_FROM}>`;
  }

  // constructor() {
  //   this.from = `Urban Insight Inc. <${process.env.EMAIL_FROM}>`;
  // }

  private newTransport(): nodemailer.Transporter {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template: string, subject: string): Promise<void> {
    const html = pug.renderFile(
      `${__dirname}/../../views/email/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText(html),
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(): Promise<void> {
    await this.send('welcome', 'Welcome to Urban Insight Inc!');
  }

  async sendPasswordReset(): Promise<void> {
    await this.send('passwordReset', 'Your password reset token');
  }

  async sendContactEmail(): Promise<void> {
    await this.send('contact_email', 'Someone will reach out to you shortly.');
  }
}

// create a transporter
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
// activate in gmail "less secure app" option
//   }); 