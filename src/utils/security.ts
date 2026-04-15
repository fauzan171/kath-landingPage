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
  } catch {
    // Don't log password verification details
    return false;
  }
};

/**
 * Rate Limiter for login attempts
 */
interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // milliseconds until limit resets
  remainingAttempts?: number;
}

class RateLimiter {
  private attempts = new Map<string, { count: number; lastAttempt: number }>();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 5 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  checkLimit(key: string): RateLimitResult {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return { allowed: true, remainingAttempts: this.maxAttempts - 1 };
    }

    // Reset if window expired
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return { allowed: true, remainingAttempts: this.maxAttempts - 1 };
    }

    // Block if max attempts exceeded
    if (attempt.count >= this.maxAttempts) {
      const retryAfter = this.windowMs - (now - attempt.lastAttempt);
      return { allowed: false, retryAfter };
    }

    // Increment counter
    this.attempts.set(key, { count: attempt.count + 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: this.maxAttempts - attempt.count - 1 };
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
 * Registration rate limiter
 * Limits registration attempts to prevent spam/abuse
 */
export const registrationRateLimiter = new RateLimiter(5, 300000); // 5 attempts per 5 minutes

/**
 * Session timeout utilities
 * NOTE: SessionProvider.tsx handles session timeout independently.
 * These functions are kept for backward compatibility but the primary
 * timeout mechanism is in SessionProvider.
 */
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes (matches SessionProvider default)

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
 * Escapes HTML entities
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

/**
 * Sanitize email address
 * Lowercase and trim
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  return email.toLowerCase().trim();
};

/**
 * Sanitize phone number
 * Keep only digits, +, and -
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[^0-9+\- ]/g, '').trim();
};

/**
 * Sanitize URL
 * Only allow safe protocols
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';

  // Trim whitespace
  const trimmed = url.trim();

  // Check for safe protocols
  const safeProtocols = ['http://', 'https://', 'mailto:', 'tel:'];
  const hasSafeProtocol = safeProtocols.some(p => trimmed.toLowerCase().startsWith(p));

  // If no protocol, assume https
  if (!hasSafeProtocol && trimmed.length > 0) {
    return 'https://' + trimmed;
  }

  return trimmed;
};

/**
 * Sanitize object - applies sanitization to all string fields
 */
export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = { ...obj } as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Special handling for known fields
      if (key.toLowerCase().includes('email')) {
        (sanitized as Record<string, unknown>)[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('tel')) {
        (sanitized as Record<string, unknown>)[key] = sanitizePhone(value);
      } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('link') || key.toLowerCase().includes('website')) {
        (sanitized as Record<string, unknown>)[key] = sanitizeUrl(value);
      } else {
        (sanitized as Record<string, unknown>)[key] = sanitizeInput(value);
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively sanitize nested objects
      (sanitized as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  return sanitized;
};

/**
 * Validate password strength
 * Returns error message if weak, null if strong
 */
export const validatePasswordStrength = (password: string): string | null => {
  if (!password || password.length < 8) {
    return 'Password minimal 8 karakter';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password harus mengandung huruf kapital';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password harus mengandung huruf kecil';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password harus mengandung angka';
  }
  // Check for common patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'abc123', 'admin'];
  const lowerPassword = password.toLowerCase();
  if (commonPatterns.some(p => lowerPassword.includes(p))) {
    return 'Password mengandung pola yang umum digunakan';
  }
  return null;
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