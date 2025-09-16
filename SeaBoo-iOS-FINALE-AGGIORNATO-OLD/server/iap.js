// iap.js
import fetch from 'cross-fetch';

const APPLE_VERIFY_PROD = 'https://buy.itunes.apple.com/verifyReceipt';
const APPLE_VERIFY_SANDBOX = 'https://sandbox.itunes.apple.com/verifyReceipt';

// Apple receipt verification status codes
const APPLE_STATUS_CODES = {
  0: 'Valid receipt',
  21000: 'The App Store could not read the JSON object you provided',
  21002: 'The data in the receipt-data property was malformed or missing',
  21003: 'The receipt could not be authenticated',
  21004: 'The shared secret you provided does not match the shared secret on file',
  21005: 'The receipt server is not currently available',
  21006: 'This receipt is valid but the subscription has expired',
  21007: 'This receipt is from the test environment, but it was sent to the production environment',
  21008: 'This receipt is from the production environment, but it was sent to the test environment',
  21009: 'Internal data access error',
  21010: 'The user account cannot be found or has been deleted'
};

/**
 * Verify Apple IAP receipt with proper error handling and status validation
 * @param {Object} params - Verification parameters
 * @param {string} params.base64Receipt - Base64 encoded receipt data
 * @param {string} params.password - App-specific shared secret (mandatory)
 * @param {boolean} params.useSandbox - Whether to use sandbox environment
 * @returns {Promise<Object>} - Verification result with proper status handling
 * @throws {Error} - If receipt is invalid or verification fails
 */
export async function verifyReceipt({ base64Receipt, password, useSandbox = false }) {
  // Critical input validations
  if (!base64Receipt) {
    throw new Error('IAP_ERROR: missing receipt data');
  }
  
  if (!password) {
    throw new Error('IAP_ERROR: APPLE_SHARED_SECRET is mandatory for receipt verification');
  }

  const body = {
    'receipt-data': base64Receipt,
    password: password,
    'exclude-old-transactions': true
  };

  const endpoint = useSandbox ? APPLE_VERIFY_SANDBOX : APPLE_VERIFY_PROD;
  
  try {
    console.log(`🔍 Verifying receipt with Apple ${useSandbox ? 'Sandbox' : 'Production'} server...`);
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`IAP_ERROR: Apple server responded with ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    
    // Handle Apple's environment mismatch responses
    if (json.status === 21007 && !useSandbox) {
      console.log('🔄 Receipt is from test environment, retrying with sandbox...');
      return verifyReceipt({ base64Receipt, password, useSandbox: true });
    }
    
    if (json.status === 21008 && useSandbox) {
      console.log('🔄 Receipt is from production environment, retrying with production...');
      return verifyReceipt({ base64Receipt, password, useSandbox: false });
    }

    // CRITICAL: Only return success if status is exactly 0
    if (json.status === 0) {
      console.log('✅ Receipt verification successful');
      return {
        success: true,
        status: json.status,
        receipt: json.receipt,
        latest_receipt_info: json.latest_receipt_info,
        pending_renewal_info: json.pending_renewal_info,
        environment: useSandbox ? 'sandbox' : 'production'
      };
    } else {
      // Handle all non-zero status codes as errors
      const statusMessage = APPLE_STATUS_CODES[json.status] || `Unknown status: ${json.status}`;
      console.error(`❌ Receipt verification failed: ${json.status} - ${statusMessage}`);
      
      throw new Error(`IAP_ERROR: ${statusMessage} (Status: ${json.status})`);
    }

  } catch (error) {
    // Re-throw IAP_ERROR prefixed errors
    if (error.message.startsWith('IAP_ERROR:')) {
      throw error;
    }
    
    // Handle network or parsing errors
    console.error('Receipt verification failed:', error);
    throw new Error(`IAP_ERROR: Network or parsing error - ${error.message}`);
  }
}

/**
 * Validate IAP transaction data for business logic
 * @param {Object} receiptData - Verified receipt data from Apple
 * @param {string} expectedProductId - Expected product ID to validate against
 * @returns {boolean} - Whether the transaction is valid for business use
 */
export function validateTransaction(receiptData, expectedProductId) {
  if (!receiptData || !receiptData.receipt) {
    return false;
  }

  const receipt = receiptData.receipt;
  
  // Check if receipt contains the expected product
  if (receipt.in_app && Array.isArray(receipt.in_app)) {
    return receipt.in_app.some(transaction => 
      transaction.product_id === expectedProductId
    );
  }

  return false;
}