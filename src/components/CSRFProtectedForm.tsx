/**
 * CSRF Protected Form Component
 *
 * Wrapper component that automatically handles CSRF token generation and validation.
 * Use this for all forms that perform state-changing operations.
 *
 * Example:
 * ```tsx
 * <CSRFProtectedForm onSubmit={handleSubmit}>
 *   <input name="field1" />
 *   <button type="submit">Submit</button>
 * </CSRFProtectedForm>
 * ```
 */

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { CSRFProtection } from '@/utils/csrf';

interface CSRFProtectedFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>, csrfValid: boolean) => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
  onCSRFError?: () => void;
}

export function CSRFProtectedForm({
  onSubmit,
  children,
  className,
  id,
  onCSRFError,
}: CSRFProtectedFormProps) {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  // Generate CSRF token on mount
  useEffect(() => {
    const initToken = async () => {
      const token = await CSRFProtection.generateToken();
      setCsrfToken(token);
      setIsReady(true);
    };

    initToken();

    // Cleanup on unmount
    return () => {
      CSRFProtection.clearToken();
    };
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Get token from form data
      const formData = new FormData(e.currentTarget);
      const submittedToken = formData.get('csrfToken') as string;

      // Validate CSRF token
      const isValid = CSRFProtection.validate(submittedToken);

      if (!isValid) {
        console.error('CSRF validation failed');
        onCSRFError?.();
        return;
      }

      // Call parent onSubmit with validation status
      onSubmit(e, isValid);

      // Generate new token for next submission
      CSRFProtection.generateToken().then(setCsrfToken);
    },
    [onSubmit, onCSRFError]
  );

  // Don't render form until CSRF token is ready
  if (!isReady) {
    return (
      <div className={className}>
        <div className="animate-pulse">Loading form...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} id={id}>
      {/* Hidden CSRF token field */}
      <input type="hidden" name="csrfToken" value={csrfToken} />
      {children}
    </form>
  );
}

/**
 * Hook for manual CSRF handling in forms
 *
 * Use this when you need more control over form submission
 *
 * Example:
 * ```tsx
 * const { token, validateAndRefresh } = useCSRFToken();
 *
 * const handleSubmit = (e) => {
 *   e.preventDefault();
 *   const submittedToken = formData.csrfToken;
 *   if (!validateAndRefresh(submittedToken)) {
 *     showError('Security validation failed. Please try again.');
 *     return;
 *   }
 *   // Proceed with submission
 * };
 * ```
 */
export function useCSRFToken() {
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Generate initial token
    CSRFProtection.generateToken().then((newToken) => {
      setToken(newToken);
    });

    // Cleanup
    return () => {
      CSRFProtection.clearToken();
    };
  }, []);

  const validateAndRefresh = useCallback((submittedToken: string): boolean => {
    const isValid = CSRFProtection.validate(submittedToken);

    if (isValid) {
      // Generate new token for next form
      CSRFProtection.generateToken().then(setToken);
    }

    return isValid;
  }, []);

  const refresh = useCallback(async () => {
    const newToken = await CSRFProtection.generateToken();
    setToken(newToken);
  }, []);

  return {
    token,
    validateAndRefresh,
    refresh,
    inputField: {
      type: 'hidden' as const,
      name: 'csrfToken',
      value: token,
    },
  };
}

export default CSRFProtectedForm;