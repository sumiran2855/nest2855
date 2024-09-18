import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

// import { AgreementService } from '../data/data.service';
import { UserService } from '../user/user.service';
@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'biswasnikhil975@gmail.com',
        pass: 'hvrthxozpizbpsth',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: 'sumiran.b@cisinlabs.com',
        to,
        subject,
        text,
      });
      console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  // async sendAgreementEmail(id: string, to: string): Promise<void> {
  //   try {
  //     const agreement =
  //       await this.agreementService.getAgreementsByUserId(id);

  //     const emailTemplatePath = join(
  //       __dirname,
  //       '..',
  //       'views',
  //       'sendAgreement.ejs',
  //     );
  //     const htmlContent = await ejs.renderFile(emailTemplatePath, {
  //       agreement,
  //     });

  //     await this.transporter.sendMail({
  //       from: 'sumiran.b@cisinlabs.com',
  //       to,
  //       subject: 'Your Agreement Details',
  //       html: htmlContent,
  //     });

  //     console.log(`Email sent to ${to}`);
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //     throw new Error('Failed to send email');
  //   }
  // }

  
}
