// Email service alternative to SendGrid
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

  static async sendBookingNotification(data: BookingEmailData): Promise<boolean> {
    try {
      // For now, log the email to console and save to file
      const emailContent = this.formatBookingEmail(data);
      
      console.log("=== EMAIL NOTIFICATION ===");
      console.log(`To: ${this.NOTIFICATION_EMAIL}`);
      console.log(`Subject: Nuova Prenotazione SeaGO - ${data.bookingCode}`);
      console.log(emailContent);
      console.log("=========================");

      // Save to file for backup
      const fs = await import('fs');
      const timestamp = new Date().toISOString();
      const emailLog = {
        timestamp,
        to: this.NOTIFICATION_EMAIL,
        subject: `Nuova Prenotazione SeaGO - ${data.bookingCode}`,
        content: emailContent,
        data
      };

      fs.appendFileSync('booking-notifications.log', JSON.stringify(emailLog) + '\n');
      
      return true;
    } catch (error) {
      console.error("Errore invio email:", error);
      return false;
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
}