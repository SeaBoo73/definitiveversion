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
      console.log(`Subject: Nuova Prenotazione SeaGO - ${data.bookingCode}`);
      console.log(emailContent);
      console.log("===============================");

      // Try to send real email if Gmail credentials are available
      if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        const transporter = this.createTransporter();
        
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: this.NOTIFICATION_EMAIL,
          subject: `🚤 Nuova Prenotazione SeaGO - ${data.bookingCode}`,
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

  private static async saveEmailBackup(data: BookingEmailData, content: string) {
    try {
      const fs = await import('fs');
      const timestamp = new Date().toISOString();
      const emailLog = {
        timestamp,
        to: this.NOTIFICATION_EMAIL,
        subject: `Nuova Prenotazione SeaGO - ${data.bookingCode}`,
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
🚤 NUOVA PRENOTAZIONE SEAGO 🚤

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
SeaGO Platform - ${new Date().toLocaleString('it-IT')}
    `.trim();
  }

  private static formatBookingEmailHTML(data: BookingEmailData): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af; text-align: center;">🚤 NUOVA PRENOTAZIONE SEAGO</h2>
      
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
        SeaGO Platform - ${new Date().toLocaleString('it-IT')}
      </p>
    </div>
    `;
  }
}