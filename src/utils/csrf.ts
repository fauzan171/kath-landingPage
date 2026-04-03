/**
 * CSRF Protection Utility
 *
 * Provides Cross-Site Request Forgery protection for state-changing operations.
 * Uses sessionStorage for token storage (more secure than localStorage for CSRF).
 *
 * Usage:
 * 1. Generate token when form mounts: const token = await CSRFProtection.generateToken()
 * 2. Include token in form data or headers
 * 3. Validate on submission: CSRFProtection.validate(submittedToken)
 */

export class CSRFProtection {
  private static TOKEN_KEY = 'csrf_token';
  private static TOKEN_EXPIRY_KEY = 'csrf_token_expiry';
  private static TOKEN_LENGTH = 32;
  private static TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

  /**
   * Generate a new CSRF token
   * Stores in sessionStorage with expiry
   */
  static async generateToken(): Promise<string> {
    // Generate cryptographically secure random token
    const bytes = new Uint8Array(this.TOKEN_LENGTH);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Store token and expiry
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, (Date.now() + this.TOKEN_EXPIRY_MS).toString());

    return token;
  }

  /**
   * Get the current CSRF token
   * Returns null if expired or not set
   */
  static getToken(): string | null {
    const token = sessionStorage.getItem(this.TOKEN_KEY);
    const expiry = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (!token || !expiry) {
      return null;
    }

    // Check if token has expired
    if (Date.now() > parseInt(expiry, 10)) {
      this.clearToken();
      return null;
    }

    return token;
  }

  /**
   * Validate a submitted CSRF token against stored token
   * Uses constant-time comparison to prevent timing attacks
   */
  static validate(submittedToken: string): boolean {
    const storedToken = this.getToken();

    if (!storedToken || !submittedToken) {
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    return this.constantTimeCompare(submittedToken, storedToken);
  }

  /**
   * Clear the stored CSRF token
   * Called after form submission or on logout
   */
  static clearToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  /**
   * Refresh token expiry without generating new token
   */
  static refreshExpiry(): void {
    const token = this.getToken();
    if (token) {
      sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, (Date.now() + this.TOKEN_EXPIRY_MS).toString());
    }
  }

  /**
   * Check if a valid token exists
   */
  static hasValidToken(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Constant-time string comparison
   * Prevents timing attacks when comparing tokens
   */
  private static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}

/**
 * React hook for CSRF protection
 * Use this in form components
 *
 * Example:
 * ```tsx
 * const { token, validateForm } = useCSRF();
 *
 * <form onSubmit={(e) => {
 *   e.preventDefault();
 *   if (!validateForm(formData.csrfToken)) {
 *     alert('Invalid CSRF token');
 *     return;
 *   }
 *   // Submit form
 * }}>
 *   <input type="hidden" name="csrfToken" value={token} />
 *   ...
 * </form>
 * ```
 */
export function useCSRF() {
  const generateNewToken = async (): Promise<string> => {
    return CSRFProtection.generateToken();
  };

  const getToken = (): string | null => {
    return CSRFProtection.getToken();
  };

  const validateForm = (submittedToken: string): boolean => {
    const isValid = CSRFProtection.validate(submittedToken);
    // Clear token after validation (one-time use)
    if (isValid) {
      CSRFProtection.clearToken();
    }
    return isValid;
  };

  const clearToken = (): void => {
    CSRFProtection.clearToken();
  };

  return {
    generateNewToken,
    getToken,
    validateForm,
    clearToken,
    hasValidToken: CSRFProtection.hasValidToken,
  };
}

/**
 * CSRF Token Header Name
 * Use this when sending token in headers
 */
export const CSRF_HEADER_NAME = 'X-CSRF-Token';

/**
 * Add CSRF token to headers object
 */
export function addCSRFHeader(headers: Record<string, string> = {}): Record<string, string> {
  const token = CSRFProtection.getToken();
  if (token) {
    headers[CSRF_HEADER_NAME] = token;
  }
  return headers;
}

/**
 * Create hidden CSRF input for forms
 * Returns HTML input element props
 */
export function createCSRFInput(): { name: string; value: string; type: string } | null {
  const token = CSRFProtection.getToken();
  if (!token) {
    // Generate a new token if none exists
    CSRFProtection.generateToken();
    const newToken = CSRFProtection.getToken();
    if (!newToken) return null;
    return {
      name: 'csrfToken',
      value: newToken,
      type: 'hidden',
    };
  }
  return {
    name: 'csrfToken',
    value: token,
    type: 'hidden',
  };
}