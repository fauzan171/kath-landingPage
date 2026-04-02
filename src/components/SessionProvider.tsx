/**
 * Session Timeout Provider
 *
 * Handles automatic session timeout with warning modal
 * - Configurable timeout duration
 * - Warning modal before logout
 * - Activity tracking (mouse, keyboard, touch)
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, LogOut, Clock } from 'lucide-react';
import { supabaseAuthService } from '@/services/supabase.service';
import { isSupabaseConfigured } from '@/config/environment';
import { toast } from 'sonner';

// ============================================
// Types
// ============================================

interface SessionContextType {
  // Time until session expires (in seconds)
  timeUntilExpiry: number;
  // Is warning modal visible
  showWarning: boolean;
  // Extend session
  extendSession: () => void;
  // Logout immediately
  logout: () => void;
  // Is session active
  isActive: boolean;
}

// ============================================
// Configuration
// ============================================

// ============================================
// Context
// ============================================

const SessionContext = createContext<SessionContextType | null>(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

// ============================================
// Provider Component
// ============================================

interface SessionProviderProps {
  children: React.ReactNode;
  // Override default timeout (in minutes)
  timeoutMinutes?: number;
  // Override warning time (in minutes)
  warningMinutes?: number;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
  timeoutMinutes = 30,
  warningMinutes = 5,
}) => {
  const navigate = useNavigate();

  // Calculate timeouts
  const sessionTimeout = timeoutMinutes * 60 * 1000;
  const warningTime = warningMinutes * 60 * 1000;

  // State
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState(sessionTimeout / 1000);
  const [isActive, setIsActive] = useState(true);

  // Refs for cleanup
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ============================================
  // Logout Function
  // ============================================

  const logout = useCallback(async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabaseAuthService.signOut();
      }
      localStorage.removeItem('cibc_current_user');
      localStorage.removeItem('user');
      setIsActive(false);
      setShowWarning(false);
      toast.info('Session expired', { description: 'You have been logged out due to inactivity.' });
      navigate('/cibc/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even on error
      navigate('/cibc/login');
    }
  }, [navigate]);

  // ============================================
  // Extend Session
  // ============================================

  const extendSession = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
    setTimeUntilExpiry(sessionTimeout / 1000);
    toast.success('Session extended');
  }, [sessionTimeout]);

  // ============================================
  // Activity Tracking
  // ============================================

  const handleActivity = useCallback(() => {
    if (!showWarning) {
      setLastActivity(Date.now());
    }
  }, [showWarning]);

  // ============================================
  // Setup Timers
  // ============================================

  useEffect(() => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Set warning timer
    warningRef.current = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (timeSinceLastActivity >= sessionTimeout - warningTime) {
        setShowWarning(true);
      }
    }, sessionTimeout - warningTime);

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      logout();
    }, sessionTimeout);

    // Set interval to update time until expiry
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      const remaining = Math.max(0, (sessionTimeout - elapsed) / 1000);
      setTimeUntilExpiry(remaining);
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lastActivity, sessionTimeout, warningTime, logout]);

  // ============================================
  // Activity Event Listeners
  // ============================================

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity]);

  // ============================================
  // Context Value
  // ============================================

  const value: SessionContextType = {
    timeUntilExpiry,
    showWarning,
    extendSession,
    logout,
    isActive,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
      {/* Warning Modal */}
      {showWarning && <SessionWarningModal />}
    </SessionContext.Provider>
  );
};

// ============================================
// Warning Modal Component
// ============================================

const SessionWarningModal: React.FC = () => {
  const { timeUntilExpiry, extendSession, logout } = useSession();
  const [countdown, setCountdown] = useState(Math.floor(timeUntilExpiry));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(Math.floor(timeUntilExpiry));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeUntilExpiry]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-gray-900">Session Timeout Warning</h3>
            <p className="text-sm text-gray-500">Your session is about to expire</p>
          </div>
        </div>

        {/* Countdown */}
        <div className="bg-amber-50 rounded-xl p-4 mb-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-sm text-amber-700">Time remaining:</p>
            <p className="text-2xl font-bold text-amber-800 font-display">{formatTime(countdown)}</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-600 text-sm mb-6">
          You will be automatically logged out due to inactivity. Click "Stay Logged In" to extend your session.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={logout}
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout Now
          </button>
          <button
            onClick={extendSession}
            className="flex-1 py-3 bg-[#FFB22C] text-[#0F0F0F] font-bold rounded-xl hover:bg-[#FFB22C]/90 transition-colors shadow-md shadow-[#FFB22C]/20"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionProvider;