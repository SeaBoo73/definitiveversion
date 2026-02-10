import nodemailer from 'nodemailer';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const verifyAttemptMap = new Map<number, { attempts: number; lockedUntil: number }>();

const SEND_COOLDOWN_MS = 60 * 1000;
const SEND_MAX_PER_WINDOW = 3;
const SEND_WINDOW_MS = 15 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const VERIFY_LOCKOUT_MS = 15 * 60 * 1000;

export class VerificationService {
  static checkSendRateLimit(userId: number, type: string): { allowed: boolean; retryAfterSeconds?: number } {
    const key = `${userId}:${type}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (entry && now < entry.resetAt) {
      if (entry.count >= SEND_MAX_PER_WINDOW) {
        return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
      }
      entry.count++;
      return { allowed: true };
    }

    rateLimitMap.set(key, { count: 1, resetAt: now + SEND_WINDOW_MS });
    return { allowed: true };
  }

  static checkVerifyAttempts(userId: number): { allowed: boolean; retryAfterSeconds?: number } {
    const now = Date.now();
    const entry = verifyAttemptMap.get(userId);

    if (entry && now < entry.lockedUntil) {
      return { allowed: false, retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000) };
    }

    if (entry && entry.attempts >= MAX_VERIFY_ATTEMPTS) {
      entry.lockedUntil = now + VERIFY_LOCKOUT_MS;
      entry.attempts = 0;
      return { allowed: false, retryAfterSeconds: Math.ceil(VERIFY_LOCKOUT_MS / 1000) };
    }

    return { allowed: true };
  }

  static recordVerifyAttempt(userId: number, success: boolean) {
    if (success) {
      verifyAttemptMap.delete(userId);
      return;
    }
    const entry = verifyAttemptMap.get(userId) || { attempts: 0, lockedUntil: 0 };
    entry.attempts++;
    verifyAttemptMap.set(userId, entry);
  }

  private static createTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendEmailVerification(userId: number, email: string): Promise<boolean> {
    try {
      const code = this.generateCode();
      const expiry = new Date(Date.now() + 15 * 60 * 1000);

      await db.update(users).set({
        verificationCode: code,
        verificationCodeExpiry: expiry,
        verificationCodeType: 'email',
      }).where(eq(users.id, userId));

      if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        const transporter = this.createTransporter();
        await transporter.sendMail({
          from: `"SeaBoo" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'SeaBoo - Codice di verifica email',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1e40af; margin: 0;">SeaBoo</h1>
                <p style="color: #64748b;">Piattaforma Noleggio Barche</p>
              </div>
              <div style="background: #f0f9ff; border-radius: 12px; padding: 30px; text-align: center;">
                <h2 style="color: #0c4a6e; margin-bottom: 10px;">Verifica il tuo indirizzo email</h2>
                <p style="color: #475569; margin-bottom: 20px;">Inserisci questo codice nell'app per verificare la tua email:</p>
                <div style="background: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 15px; margin: 20px auto; max-width: 200px;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e40af;">${code}</span>
                </div>
                <p style="color: #94a3b8; font-size: 13px;">Il codice scade tra 15 minuti.</p>
              </div>
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                Se non hai richiesto questo codice, puoi ignorare questa email.
              </p>
            </div>
          `
        });
        console.log(`[VERIFICATION] Email OTP inviato a ${email}`);
        return true;
      } else {
        console.log(`[VERIFICATION] Gmail non configurato. Codice email per user ${userId}: ${code}`);
        return true;
      }
    } catch (error) {
      console.error('[VERIFICATION] Errore invio email OTP:', error);
      return false;
    }
  }

  static async sendPhoneVerification(userId: number, phone: string): Promise<boolean> {
    try {
      const code = this.generateCode();
      const expiry = new Date(Date.now() + 15 * 60 * 1000);

      await db.update(users).set({
        verificationCode: code,
        verificationCodeExpiry: expiry,
        verificationCodeType: 'phone',
      }).where(eq(users.id, userId));

      // Twilio via Replit connector integration
      try {
        const { getTwilioClient, getTwilioFromPhoneNumber } = await import('./twilio-connector');
        const client = await getTwilioClient();
        const fromNumber = await getTwilioFromPhoneNumber();
        await client.messages.create({
          body: `SeaBoo - Il tuo codice di verifica è: ${code}. Scade tra 15 minuti.`,
          from: fromNumber,
          to: phone,
        });
        console.log(`[VERIFICATION] SMS OTP inviato a ${phone}`);
        return true;
      } catch (twilioError) {
        console.log(`[VERIFICATION] Twilio non disponibile, fallback email. Errore: ${twilioError}`);
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
          const [user] = await db.select().from(users).where(eq(users.id, userId));
          if (user?.email) {
            const transporter = this.createTransporter();
            await transporter.sendMail({
              from: `"SeaBoo" <${process.env.GMAIL_USER}>`,
              to: user.email,
              subject: 'SeaBoo - Codice di verifica telefono',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1e40af; margin: 0;">SeaBoo</h1>
                    <p style="color: #64748b;">Piattaforma Noleggio Barche</p>
                  </div>
                  <div style="background: #f0fdf4; border-radius: 12px; padding: 30px; text-align: center;">
                    <h2 style="color: #166534; margin-bottom: 10px;">Verifica il tuo numero di telefono</h2>
                    <p style="color: #475569; margin-bottom: 5px;">Numero: <strong>${phone}</strong></p>
                    <p style="color: #475569; margin-bottom: 20px;">Inserisci questo codice nell'app:</p>
                    <div style="background: white; border: 2px solid #22c55e; border-radius: 8px; padding: 15px; margin: 20px auto; max-width: 200px;">
                      <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #166534;">${code}</span>
                    </div>
                    <p style="color: #94a3b8; font-size: 13px;">Il codice scade tra 15 minuti.</p>
                    <p style="color: #f59e0b; font-size: 12px; margin-top: 10px;">
                      (Codice inviato via email perché il servizio SMS non è al momento disponibile)
                    </p>
                  </div>
                </div>
              `
            });
            console.log(`[VERIFICATION] Codice telefono inviato via email a ${user.email} (fallback)`);
          }
        }
        return true;
      }
    } catch (error) {
      console.error('[VERIFICATION] Errore invio phone OTP:', error);
      return false;
    }
  }

  static async verifyCode(userId: number, code: string, type: 'email' | 'phone'): Promise<{ success: boolean; message: string }> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!user) {
        return { success: false, message: 'Utente non trovato' };
      }

      if (!user.verificationCode || !user.verificationCodeExpiry || user.verificationCodeType !== type) {
        return { success: false, message: 'Nessun codice di verifica attivo. Richiedi un nuovo codice.' };
      }

      if (new Date() > new Date(user.verificationCodeExpiry)) {
        await db.update(users).set({
          verificationCode: null,
          verificationCodeExpiry: null,
          verificationCodeType: null,
        }).where(eq(users.id, userId));
        return { success: false, message: 'Codice scaduto. Richiedi un nuovo codice.' };
      }

      if (user.verificationCode !== code) {
        return { success: false, message: 'Codice non valido. Riprova.' };
      }

      const updateData: any = {
        verificationCode: null,
        verificationCodeExpiry: null,
        verificationCodeType: null,
      };

      if (type === 'email') {
        updateData.emailVerified = true;
      } else {
        updateData.phoneVerified = true;
      }

      await db.update(users).set(updateData).where(eq(users.id, userId));

      return { success: true, message: type === 'email' ? 'Email verificata con successo!' : 'Telefono verificato con successo!' };
    } catch (error) {
      console.error('[VERIFICATION] Errore verifica codice:', error);
      return { success: false, message: 'Errore durante la verifica. Riprova.' };
    }
  }

  static maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return '***@***';
    const maskedLocal = local.length <= 2 
      ? '*'.repeat(local.length) 
      : local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
    return `${maskedLocal}@${domain}`;
  }

  static maskPhone(phone: string): string {
    if (!phone || phone.length < 6) return '***';
    const cleaned = phone.replace(/\s/g, '');
    return cleaned.slice(0, 4) + '*'.repeat(cleaned.length - 6) + cleaned.slice(-2);
  }
}
