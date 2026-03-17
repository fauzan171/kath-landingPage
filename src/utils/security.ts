/**
 * Security Utilities
 *
 * Provides secure password hashing using Web Crypto API
 * and other security-related utilities
 */

/**
 * Hash password using SHA-256 with salt
 * Uses Web Crypto API for secure client-side hashing
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Generate random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltedPassword = new Uint8Array(salt.length + data.length);
  saltedPassword.set(salt);
  saltedPassword.set(data, salt.length);

  // Hash with SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Return salt:hash
  return Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('') + ':' + hashHex;
};

/**
 * Verify password against hashed value
 */
export const verifyPassword = async (password: string, hashed: string): Promise<boolean> => {
  try {
    const [saltHex, storedHash] = hashed.split(':');
    if (!saltHex || !storedHash) return false;

    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const saltedPassword = new Uint8Array(salt.length + data.length);
    saltedPassword.set(salt);
    saltedPassword.set(data, salt.length);

    const hashBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex === storedHash;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
};

/**
 * Rate Limiter for login attempts
 */
class RateLimiter {
  private attempts = new Map<string, { count: number; lastAttempt: number }>();
  private maxAttempts = 5;
  private windowMs = 5 * 60 * 1000; // 5 minutes

  checkLimit(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window expired
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Block if max attempts exceeded
    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    // Increment counter
    this.attempts.set(key, { count: attempt.count + 1, lastAttempt: now });
    return true;
  }

  reset(key: string) {
    this.attempts.delete(key);
  }

  getRemainingTime(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return 0;
    return Math.max(0, this.windowMs - (Date.now() - attempt.lastAttempt));
  }
}

export const loginRateLimiter = new RateLimiter();

/**
 * Session timeout utilities
 */
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const checkSessionTimeout = (): boolean => {
  const lastActivity = localStorage.getItem('lastActivity');
  if (!lastActivity) return true;

  return Date.now() - parseInt(lastActivity) < SESSION_TIMEOUT;
};

export const updateLastActivity = () => {
  localStorage.setItem('lastActivity', Date.now().toString());
};

/**
 * Generate CSRF Token (for future backend integration)
 */
export const generateCSRFToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .reduce((memo, i) => memo + i.toString(16).padStart(2, '0'), '');
};

/**
 * Validate CSRF Token
 */
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  if (!token || !storedToken) return false;
  return token === storedToken;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Generate secure random ID
 */
export const generateSecureId = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};