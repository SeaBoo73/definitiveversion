// appleAuth.js
import { createRemoteJWKSet, jwtVerify } from 'jose';

const appleJWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));

/**
 * Securely verify Apple ID token with mandatory audience validation
 * @param {string} idToken - The Apple ID token to verify
 * @param {string} audience - APPLE_CLIENT_ID or BUNDLE_ID (mandatory for security)
 * @returns {Promise<object>} - Verified JWT payload with user info
 * @throws {Error} - If token is invalid or audience missing
 */
export async function verifyAppleIdToken(idToken, audience) {
  // Critical security validations
  if (!idToken) {
    throw new Error('APPLE_AUTH_ERROR: missing id_token');
  }
  
  if (!audience) {
    throw new Error('APPLE_AUTH_ERROR: audience (APPLE_CLIENT_ID or BUNDLE_ID) is mandatory for security');
  }

  try {
    const { payload } = await jwtVerify(idToken, appleJWKS, {
      issuer: 'https://appleid.apple.com',
      audience: audience,
      // Add extra security validations
      algorithms: ['RS256'],
    });

    // Validate required claims
    if (!payload.sub) {
      throw new Error('APPLE_AUTH_ERROR: missing user identifier (sub)');
    }

    // Log successful verification (without sensitive data)
    console.log(`✅ Apple ID token verified for user: ${payload.sub.substring(0, 8)}...`);
    
    return {
      sub: payload.sub,
      email: payload.email || null, // Email only provided on first authorization
      email_verified: payload.email_verified === 'true' || payload.email_verified === true,
      iss: payload.iss,
      aud: payload.aud,
      exp: payload.exp,
      iat: payload.iat,
      auth_time: payload.auth_time
    };
  } catch (error) {
    // Enhanced error handling for Apple token verification
    if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      throw new Error('APPLE_AUTH_ERROR: Invalid token signature');
    }
    if (error.code === 'ERR_JWT_EXPIRED') {
      throw new Error('APPLE_AUTH_ERROR: Token has expired');
    }
    if (error.code === 'ERR_JWT_AUDIENCE_INVALID') {
      throw new Error('APPLE_AUTH_ERROR: Invalid audience - check APPLE_CLIENT_ID');
    }
    if (error.code === 'ERR_JWT_ISSUER_INVALID') {
      throw new Error('APPLE_AUTH_ERROR: Invalid issuer - not from Apple');
    }
    
    // Re-throw with proper prefix if already our error
    if (error.message.startsWith('APPLE_AUTH_ERROR:')) {
      throw error;
    }
    
    // Generic error for unexpected issues
    console.error('Apple ID token verification failed:', error);
    throw new Error(`APPLE_AUTH_ERROR: Token verification failed - ${error.message}`);
  }
}