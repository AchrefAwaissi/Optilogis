import { Injectable, Logger } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';
import * as nodemailer from 'nodemailer';

interface UserMessageCount {
  count: number;
  lastReset: Date;
}

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(ContactService.name);
  private userMessageCounts: { [email: string]: UserMessageCount } = {};

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'vetswyt673@gmail.com',
        pass: 'gdktyrnbyporwcxq',
      },
      tls: { rejectUnauthorized: false }
    });

    this.verifySmtpConnection();
    setInterval(() => this.cleanupOldEntries(), 3600000); // Nettoyage toutes les heures
  }

  private async verifySmtpConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('Connexion SMTP vérifiée avec succès');
    } catch (error) {
      this.logger.error('Erreur lors de la vérification de la connexion SMTP:', error);
    }
  }

  private cleanupOldEntries() {
    const now = new Date();
    for (const [email, data] of Object.entries(this.userMessageCounts)) {
      if (now.getTime() - data.lastReset.getTime() > 24 * 60 * 60 * 1000) {
        delete this.userMessageCounts[email];
      }
    }
  }

  private checkRateLimit(email: string): boolean {
    const now = new Date();
    if (!this.userMessageCounts[email]) {
      this.userMessageCounts[email] = { count: 0, lastReset: now };
    }

    const userData = this.userMessageCounts[email];
    if (now.getTime() - userData.lastReset.getTime() > 24 * 60 * 60 * 1000) {
      userData.count = 0;
      userData.lastReset = now;
    }

    if (userData.count >= 2) {
      return false;
    }

    userData.count++;
    return true;
  }

  async submitContact(contactDto: ContactDto) {
    const { name, email, message } = contactDto;

    if (!this.checkRateLimit(email)) {
      return {
        success: false,
        message: 'Limite de 2 messages par 24 heures atteinte. Veuillez réessayer plus tard.',
      };
    }

    const mailOptions = {
      from: '"Service de Contact Optilogis"',
      to: 'percedimvu@gmail.com',
      replyTo: email,
      subject: `Nouveau message de contact de ${name} (${email})`,
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}\n\nPour répondre directement à l'expéditeur, utilisez l'adresse : ${email}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Pour répondre directement à l'expéditeur, utilisez l'adresse : ${email}</p>
      `
    };

    try {
      this.logger.log(`Tentative d'envoi d'e-mail à ${mailOptions.to}`);
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`E-mail envoyé avec succès: ${info.messageId}`);
      return { success: true, message: 'Le formulaire de contact a été soumis et envoyé par e-mail avec succès' };
    } catch (error) {
      this.logger.error('Erreur lors de l\'envoi de l\'e-mail:', error);
      if (error.responseCode) {
        this.logger.error(`Code de réponse SMTP: ${error.responseCode}`);
      }
      return { 
        success: false, 
        message: 'Une erreur est survenue lors de l\'envoi de l\'e-mail',
        error: error.message
      };
    }
  }
}