import nodemailer from 'nodemailer';

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  ownerName: string;
  ownerEmail: string;
  startDate: string;
  endDate: string;
  boatType: string;
  boatName: string;
  totalPrice: number;
  paymentMethod: string;
  bookingCode: string;
}

interface MooringBookingEmailData {
  customerName: string;
  customerEmail: string;
  managerName: string;
  managerEmail: string;
  startDate: string;
  endDate: string;
  mooringName: string;
  mooringPort: string;
  mooringLocation: string;
  mooringType: string;
  boatName: string;
  boatType: string;
  boatLength: string;
  totalPrice: number;
  paymentMethod: string;
  bookingCode: string;
  specialRequests?: string;
  notes?: string;
}

export class EmailService {
  private static readonly NOTIFICATION_EMAIL = "app.seago.italia@gmail.com";
  
  private static createTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  static async sendBookingNotification(data: BookingEmailData): Promise<boolean> {
    try {
      const emailContent = this.formatBookingEmail(data);
      
      console.log("=== INVIO EMAIL NOTIFICATION ===");
      console.log(`To: ${this.NOTIFICATION_EMAIL}`);
      console.log(`Subject: Nuova Prenotazione SeaBoo - ${data.bookingCode}`);
      console.log(emailContent);
      console.log("===============================");

      // Try to send real email if Gmail credentials are available
      if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        const transporter = this.createTransporter();
        
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: this.NOTIFICATION_EMAIL,
          subject: `🚤 Nuova Prenotazione SeaBoo - ${data.bookingCode}`,
          text: emailContent,
          html: this.formatBookingEmailHTML(data)
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("✅ EMAIL INVIATA CON SUCCESSO:", result.messageId);
        
        await this.saveEmailBackup(data, emailContent);
        return true;
      } else {
        console.log("⚠️ Credenziali Gmail non configurate, salvo solo log");
        await this.saveEmailBackup(data, emailContent);
        return false;
      }
      
    } catch (error) {
      console.error("❌ Errore invio email:", error);
      await this.saveEmailBackup(data, this.formatBookingEmail(data));
      return false;
    }
  }

  static async sendMooringBookingNotification(data: MooringBookingEmailData): Promise<boolean> {
    try {
      const emailContent = this.formatMooringBookingEmail(data);
      
      console.log("=== INVIO EMAIL NOTIFICATION ORMEGGIO ===");
      console.log(`To: ${this.NOTIFICATION_EMAIL}`);
      console.log(`Subject: Nuova Prenotazione Ormeggio SeaBoo - ${data.bookingCode}`);
      console.log(emailContent);
      console.log("=========================================");

      // Try to send real email if Gmail credentials are available
      if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        const transporter = this.createTransporter();
        
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: this.NOTIFICATION_EMAIL,
          subject: `⚓ Nuova Prenotazione Ormeggio SeaBoo - ${data.bookingCode}`,
          text: emailContent,
          html: this.formatMooringBookingEmailHTML(data)
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("✅ EMAIL ORMEGGIO INVIATA CON SUCCESSO:", result.messageId);
        
        await this.saveMooringEmailBackup(data, emailContent);
        return true;
      } else {
        console.log("⚠️ Credenziali Gmail non configurate, salvo solo log ormeggio");
        await this.saveMooringEmailBackup(data, emailContent);
        return false;
      }
      
    } catch (error) {
      console.error("❌ Errore invio email ormeggio:", error);
      await this.saveMooringEmailBackup(data, this.formatMooringBookingEmail(data));
      return false;
    }
  }

  private static async saveEmailBackup(data: BookingEmailData, content: string) {
    try {
      const fs = await import('fs');
      const timestamp = new Date().toISOString();
      const emailLog = {
        timestamp,
        to: this.NOTIFICATION_EMAIL,
        subject: `Nuova Prenotazione SeaBoo - ${data.bookingCode}`,
        content,
        data,
        status: 'logged'
      };

      fs.default.appendFileSync('booking-notifications.log', JSON.stringify(emailLog) + '\n');
    } catch (error) {
      console.error("Errore salvataggio backup:", error);
    }
  }

  private static formatBookingEmail(data: BookingEmailData): string {
    return `
🚤 NUOVA PRENOTAZIONE SEABOO 🚤

📋 DETTAGLI PRENOTAZIONE:
• Codice Prenotazione: ${data.bookingCode}
• Imbarcazione: ${data.boatName} (${data.boatType})
• Date: ${data.startDate} → ${data.endDate}
• Prezzo Totale: €${data.totalPrice}
• Metodo Pagamento: ${data.paymentMethod}

👤 CLIENTE:
• Nome: ${data.customerName}
• Email: ${data.customerEmail}

🏗️ NOLEGGIATORE:
• Nome: ${data.ownerName}  
• Email: ${data.ownerEmail}

💳 PAGAMENTO COMPLETATO CON SUCCESSO
Prenotazione confermata e attiva nel sistema.

---
SeaBoo Platform - ${new Date().toLocaleString('it-IT')}
    `.trim();
  }

  private static formatBookingEmailHTML(data: BookingEmailData): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af; text-align: center;">🚤 NUOVA PRENOTAZIONE SEABOO</h2>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #334155;">📋 DETTAGLI PRENOTAZIONE</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Codice Prenotazione:</strong> ${data.bookingCode}</li>
          <li><strong>Imbarcazione:</strong> ${data.boatName} (${data.boatType})</li>
          <li><strong>Date:</strong> ${data.startDate} → ${data.endDate}</li>
          <li><strong>Prezzo Totale:</strong> €${data.totalPrice}</li>
          <li><strong>Metodo Pagamento:</strong> ${data.paymentMethod}</li>
        </ul>
      </div>

      <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #047857;">👤 CLIENTE</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Nome:</strong> ${data.customerName}</li>
          <li><strong>Email:</strong> ${data.customerEmail}</li>
        </ul>
      </div>

      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #92400e;">🏗️ NOLEGGIATORE</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Nome:</strong> ${data.ownerName}</li>
          <li><strong>Email:</strong> ${data.ownerEmail}</li>
        </ul>
      </div>

      <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="color: #1d4ed8;">💳 PAGAMENTO COMPLETATO CON SUCCESSO</h3>
        <p>Prenotazione confermata e attiva nel sistema.</p>
      </div>

      <hr style="margin: 30px 0; border: 1px solid #e2e8f0;">
      <p style="text-align: center; color: #64748b; font-size: 12px;">
        SeaBoo Platform - ${new Date().toLocaleString('it-IT')}
      </p>
    </div>
    `;
  }

  private static formatMooringBookingEmail(data: MooringBookingEmailData): string {
    return `
⚓ NUOVA PRENOTAZIONE ORMEGGIO SEABOO ⚓

📋 DETTAGLI PRENOTAZIONE ORMEGGIO:
• Codice Prenotazione: ${data.bookingCode}
• Ormeggio: ${data.mooringName} (${data.mooringType})
• Porto: ${data.mooringPort}
• Località: ${data.mooringLocation}
• Date: ${data.startDate} → ${data.endDate}
• Prezzo Totale: €${data.totalPrice}
• Metodo Pagamento: ${data.paymentMethod}

🚤 IMBARCAZIONE:
• Nome: ${data.boatName}
• Tipo: ${data.boatType}
• Lunghezza: ${data.boatLength}m

👤 CLIENTE:
• Nome: ${data.customerName}
• Email: ${data.customerEmail}

🏗️ GESTORE ORMEGGIO:
• Nome: ${data.managerName}
• Email: ${data.managerEmail}

${data.specialRequests ? `🔧 RICHIESTE SPECIALI:
${data.specialRequests}

` : ''}${data.notes ? `📝 NOTE:
${data.notes}

` : ''}💳 PAGAMENTO COMPLETATO CON SUCCESSO
Prenotazione ormeggio confermata e attiva nel sistema.

---
SeaBoo Platform - ${new Date().toLocaleString('it-IT')}
    `.trim();
  }

  private static formatMooringBookingEmailHTML(data: MooringBookingEmailData): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0c4a6e; text-align: center;">⚓ NUOVA PRENOTAZIONE ORMEGGIO SEABOO</h2>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0c4a6e;">📋 DETTAGLI PRENOTAZIONE ORMEGGIO</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Codice Prenotazione:</strong> ${data.bookingCode}</li>
          <li><strong>Ormeggio:</strong> ${data.mooringName} (${data.mooringType})</li>
          <li><strong>Porto:</strong> ${data.mooringPort}</li>
          <li><strong>Località:</strong> ${data.mooringLocation}</li>
          <li><strong>Date:</strong> ${data.startDate} → ${data.endDate}</li>
          <li><strong>Prezzo Totale:</strong> €${data.totalPrice}</li>
          <li><strong>Metodo Pagamento:</strong> ${data.paymentMethod}</li>
        </ul>
      </div>

      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af;">🚤 IMBARCAZIONE</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Nome:</strong> ${data.boatName}</li>
          <li><strong>Tipo:</strong> ${data.boatType}</li>
          <li><strong>Lunghezza:</strong> ${data.boatLength}m</li>
        </ul>
      </div>

      <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #047857;">👤 CLIENTE</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Nome:</strong> ${data.customerName}</li>
          <li><strong>Email:</strong> ${data.customerEmail}</li>
        </ul>
      </div>

      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #92400e;">🏗️ GESTORE ORMEGGIO</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Nome:</strong> ${data.managerName}</li>
          <li><strong>Email:</strong> ${data.managerEmail}</li>
        </ul>
      </div>

      ${data.specialRequests ? `
      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #b91c1c;">🔧 RICHIESTE SPECIALI</h3>
        <p>${data.specialRequests}</p>
      </div>
      ` : ''}

      ${data.notes ? `
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151;">📝 NOTE</h3>
        <p>${data.notes}</p>
      </div>
      ` : ''}

      <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="color: #1d4ed8;">💳 PAGAMENTO COMPLETATO CON SUCCESSO</h3>
        <p>Prenotazione ormeggio confermata e attiva nel sistema.</p>
      </div>

      <hr style="margin: 30px 0; border: 1px solid #e2e8f0;">
      <p style="text-align: center; color: #64748b; font-size: 12px;">
        SeaBoo Platform - ${new Date().toLocaleString('it-IT')}
      </p>
    </div>
    `;
  }

  static async sendCustomerConfirmationEmail(data: BookingEmailData): Promise<boolean> {
    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.log("⚠️ Credenziali Gmail non configurate, impossibile inviare conferma al cliente");
        return false;
      }

      const transporter = this.createTransporter();
      const mailOptions = {
        from: `"SeaBoo" <${process.env.GMAIL_USER}>`,
        to: data.customerEmail,
        subject: `Conferma Prenotazione SeaBoo - ${data.bookingCode}`,
        html: this.formatCustomerConfirmationHTML(data)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ EMAIL CONFERMA CLIENTE INVIATA:", result.messageId);
      return true;
    } catch (error) {
      console.error("❌ Errore invio email conferma cliente:", error);
      return false;
    }
  }

  private static formatCustomerConfirmationHTML(data: BookingEmailData): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #1e40af, #0891b2); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">SeaBoo</h1>
        <p style="color: #e0f2fe; margin: 8px 0 0;">Prenotazione Confermata</p>
      </div>
      
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #334155;">Ciao <strong>${data.customerName}</strong>,</p>
        <p style="color: #64748b;">La tua prenotazione su SeaBoo è stata confermata con successo!</p>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #166534; margin-top: 0;">Riepilogo Prenotazione</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #64748b;">Codice:</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${data.bookingCode}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">${data.boatType}:</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${data.boatName}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Dal:</td><td style="padding: 6px 0; text-align: right;">${data.startDate}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Al:</td><td style="padding: 6px 0; text-align: right;">${data.endDate}</td></tr>
            <tr style="border-top: 1px solid #d1fae5;"><td style="padding: 10px 0 0; font-weight: bold;">Totale:</td><td style="padding: 10px 0 0; font-weight: bold; text-align: right; color: #166534; font-size: 18px;">&euro;${data.totalPrice.toFixed(2)}</td></tr>
          </table>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #334155; margin-top: 0;">Proprietario</h3>
          <p style="margin: 4px 0; color: #64748b;"><strong>${data.ownerName}</strong></p>
          <p style="margin: 4px 0; color: #64748b;">${data.ownerEmail}</p>
        </div>

        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Cosa fare ora</h3>
          <ul style="color: #475569; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Il proprietario ti contatterà per organizzare i dettagli</li>
            <li style="margin-bottom: 8px;">Prepara documento d'identità valido</li>
            <li style="margin-bottom: 8px;">Puoi gestire la prenotazione dalla sezione "Le mie prenotazioni"</li>
            <li>Cancellazione gratuita fino a 24 ore prima</li>
          </ul>
        </div>
      </div>

      <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          SeaBoo - La tua piattaforma per il noleggio nautico in Italia<br>
          ${new Date().toLocaleString('it-IT')}
        </p>
      </div>
    </div>
    `;
  }

  private static async saveMooringEmailBackup(data: MooringBookingEmailData, content: string) {
    try {
      const fs = await import('fs');
      const timestamp = new Date().toISOString();
      const emailLog = {
        timestamp,
        type: 'mooring_booking_notification',
        to: this.NOTIFICATION_EMAIL,
        bookingCode: data.bookingCode,
        mooringName: data.mooringName,
        customerName: data.customerName,
        totalPrice: data.totalPrice,
        content
      };
      
      const logEntry = `${timestamp} - MOORING BOOKING NOTIFICATION: ${JSON.stringify(emailLog)}\n`;
      await fs.promises.appendFile('booking-notifications.log', logEntry);
    } catch (error) {
      console.error("Errore salvataggio backup ormeggio:", error);
    }
  }
}