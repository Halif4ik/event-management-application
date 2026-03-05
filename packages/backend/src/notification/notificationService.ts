import {Injectable,} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import sgMail from '@sendgrid/mail';



@Injectable()
export class NotificationService {
   constructor(private readonly configService: ConfigService) {
      const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY') ;
      if (!sendGridApiKey) throw new Error('SENDGRID_API_KEY is not set in the configuration.');
      sgMail.setApiKey(sendGridApiKey);
   }

   async emailVerify(customersEmail: string): Promise<number> {
      try {
         const verifiedEmail = this.configService.get<string>('VERIFIED_EMAIL');
         if (!verifiedEmail)
            throw new Error('VERIFIED_EMAIL is not set in the configuration.');

         const randomForVerificationForDigit: number = Math.floor(1000 + Math.random() * 9000);
         // Create email messages for  customers
         const emailText = {
            to: customersEmail,
            from: verifiedEmail,
            subject: 'Verification',
            text: `Code for verification`,
            html: `
            <p>Hello</p>
            <p>Your 4 digit code ${randomForVerificationForDigit}</p>
            <p>Thank you,</p>
            <p>Your Team</p>
          `,
         }
         await sgMail.send(emailText);
         return randomForVerificationForDigit;
      } catch (error) {
         console.error('Error sending email notifications:', error);
         throw new Error('Failed to send email notifications.');
      }

   }

}
