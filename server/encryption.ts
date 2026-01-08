import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// Use a secure key from environment or generate a deterministic one
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY || process.env.SESSION_SECRET || 'seaboo-default-encryption-key-2025';
  // Derive a 32-byte key using SHA-256
  return crypto.createHash('sha256').update(secret).digest();
}

export function encrypt(text: string): string {
  if (!text) return '';
  
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Fallback to plain text if encryption fails
  }
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  
  // Check if the text is already encrypted (contains colons in expected format)
  if (!encryptedText.includes(':') || encryptedText.split(':').length !== 3) {
    // Not encrypted, return as-is (for backward compatibility)
    return encryptedText;
  }
  
  try {
    const key = getEncryptionKey();
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    // If decryption fails, the data might not be encrypted
    return encryptedText;
  }
}

// Mask IBAN - show only last 4 characters
export function maskIban(iban: string | null): string {
  if (!iban) return '';
  // Remove spaces for processing
  const cleanIban = iban.replace(/\s/g, '');
  if (cleanIban.length <= 4) return cleanIban;
  // Show first 4 (country + check) and last 4 characters
  const visible = cleanIban.slice(0, 4) + ' **** **** **** ' + cleanIban.slice(-4);
  return visible;
}

// Mask bank account holder name - show only first letter and last name initial
export function maskAccountHolder(name: string | null): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0) + '***';
  }
  // First name first char + *** + Last name first char + ***
  return parts[0].charAt(0) + '*** ' + parts[parts.length - 1].charAt(0) + '***';
}

// Helper functions for banking data
export function encryptBankingData(data: {
  iban?: string | null;
  bankName?: string | null;
  accountHolder?: string | null;
  swiftBic?: string | null;
}): {
  iban?: string | null;
  bankName?: string | null;
  accountHolder?: string | null;
  swiftBic?: string | null;
} {
  return {
    iban: data.iban ? encrypt(data.iban) : data.iban,
    bankName: data.bankName ? encrypt(data.bankName) : data.bankName,
    accountHolder: data.accountHolder ? encrypt(data.accountHolder) : data.accountHolder,
    swiftBic: data.swiftBic ? encrypt(data.swiftBic) : data.swiftBic,
  };
}

export function decryptBankingData(data: {
  iban?: string | null;
  bankName?: string | null;
  accountHolder?: string | null;
  swiftBic?: string | null;
}): {
  iban?: string | null;
  bankName?: string | null;
  accountHolder?: string | null;
  swiftBic?: string | null;
} {
  return {
    iban: data.iban ? decrypt(data.iban) : data.iban,
    bankName: data.bankName ? decrypt(data.bankName) : data.bankName,
    accountHolder: data.accountHolder ? decrypt(data.accountHolder) : data.accountHolder,
    swiftBic: data.swiftBic ? decrypt(data.swiftBic) : data.swiftBic,
  };
}
