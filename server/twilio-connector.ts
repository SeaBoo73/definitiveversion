// Twilio integration via Replit connector
import twilio from 'twilio';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=twilio',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings) {
    throw new Error('Twilio not connected - no connection settings returned');
  }

  const settings = connectionSettings.settings || {};
  console.log('[TWILIO] Connection settings keys:', Object.keys(settings));
  console.log('[TWILIO] account_sid starts with:', settings.account_sid?.substring(0, 5));
  console.log('[TWILIO] api_key starts with:', settings.api_key?.substring(0, 5));
  console.log('[TWILIO] phone_number:', settings.phone_number);

  if (!settings.account_sid || !settings.api_key || !settings.api_key_secret) {
    throw new Error('Twilio not connected - missing credentials');
  }
  return {
    accountSid: settings.account_sid,
    apiKey: settings.api_key,
    apiKeySecret: settings.api_key_secret,
    phoneNumber: settings.phone_number
  };
}

export async function getTwilioClient() {
  const { accountSid, apiKey, apiKeySecret } = await getCredentials();
  
  if (accountSid && accountSid.startsWith('AC')) {
    if (apiKey && apiKeySecret) {
      return twilio(apiKey, apiKeySecret, { accountSid });
    }
    return twilio(accountSid, apiKeySecret);
  }
  
  if (apiKey && apiKey.startsWith('AC')) {
    return twilio(apiKey, apiKeySecret);
  }
  
  throw new Error(`Invalid Twilio credentials: accountSid=${accountSid?.substring(0, 5)}, apiKey=${apiKey?.substring(0, 5)}`);
}

export async function getTwilioFromPhoneNumber() {
  const { phoneNumber } = await getCredentials();
  return phoneNumber;
}
