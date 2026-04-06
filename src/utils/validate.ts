/**
 * Validation Utilities
 *
 * Provides validation functions for user inputs
 */

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

/**
 * Validate password strength
 * Returns validation result with errors and strength rating
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (!password) {
    return { isValid: false, errors: ['Password is required'], strength: 'weak' };
  }

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Special character check (bonus)
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  // Check for common patterns
  const commonPatterns = [
    'password', '123456', 'qwerty', 'abc123', 'admin',
    'letmein', 'welcome', 'monkey', 'dragon', 'master'
  ];
  const lowerPassword = password.toLowerCase();
  const hasCommonPattern = commonPatterns.some(p => lowerPassword.includes(p));

  if (hasCommonPattern) {
    errors.push('Password contains common patterns');
  }

  // Calculate strength
  const passedChecks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    hasSpecialChar,
    !hasCommonPattern,
    password.length >= 12, // Bonus for longer passwords
  ].filter(Boolean).length;

  if (passedChecks >= 6) {
    strength = 'strong';
  } else if (passedChecks >= 4) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Validate phone number (Indonesian format)
 */
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');

  // Indonesian phone number patterns
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid Indonesian phone number' };
  }

  return { isValid: true };
};

/**
 * Validate name
 */
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.trim().length > 100) {
    return { isValid: false, error: 'Name must be less than 100 characters' };
  }

  // Only allow letters, spaces, and common name characters
  const nameRegex = /^[a-zA-Z\s'\-.]+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true };
};

/**
 * Validate URL
 */
export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url) {
    return { isValid: true }; // URL is optional
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

/**
 * Validate team name
 */
export const validateTeamName = (name: string): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: 'Team name is required' };
  }

  if (name.trim().length < 3) {
    return { isValid: false, error: 'Team name must be at least 3 characters' };
  }

  if (name.trim().length > 50) {
    return { isValid: false, error: 'Team name must be less than 50 characters' };
  }

  return { isValid: true };
};

/**
 * Validate institution name
 */
export const validateInstitution = (institution: string): { isValid: boolean; error?: string } => {
  if (!institution) {
    return { isValid: false, error: 'Institution name is required' };
  }

  if (institution.trim().length < 2) {
    return { isValid: false, error: 'Institution name must be at least 2 characters' };
  }

  if (institution.trim().length > 100) {
    return { isValid: false, error: 'Institution name must be less than 100 characters' };
  }

  return { isValid: true };
};

/**
 * Get password strength color for UI
 */
export const getPasswordStrengthColor = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'strong':
      return 'text-green-500';
    case 'medium':
      return 'text-yellow-500';
    case 'weak':
    default:
      return 'text-red-500';
  }
};

/**
 * Get password strength label for UI
 */
export const getPasswordStrengthLabel = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'strong':
      return 'Strong';
    case 'medium':
      return 'Medium';
    case 'weak':
    default:
      return 'Weak';
  }
};