/**
 * Logger Utility
 *
 * Structured logging that respects environment.
 * In production: only errors and warnings are logged.
 * In development: all levels are logged.
 *
 * Usage:
 *   import { logger } from '@/utils/logger';
 *   logger.info('User logged in', { userId: '123' });
 *   logger.error('Failed to save', error);
 *   logger.warn('Deprecated API used');
 *   logger.debug('Component rendered', { props });
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

const isDev = import.meta.env.DEV;

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// In production, only show warn and error
const MIN_LEVEL: LogLevel = isDev ? 'debug' : 'warn';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function formatEntry(entry: LogEntry): string {
  const prefix = entry.context ? `[${entry.context}]` : '';
  return `${prefix} ${entry.message}`;
}

function createLogMethod(level: LogLevel) {
  return (message: string, data?: unknown, context?: string) => {
    if (!shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      context,
      data,
      timestamp: new Date().toISOString(),
    };

    const formatted = formatEntry(entry);

    switch (level) {
      case 'debug':
        console.debug(formatted, data !== undefined ? data : '');
        break;
      case 'info':
        console.info(formatted, data !== undefined ? data : '');
        break;
      case 'warn':
        console.warn(formatted, data !== undefined ? data : '');
        break;
      case 'error':
        console.error(formatted, data !== undefined ? data : '');
        break;
    }
  };
}

export const logger = {
  debug: createLogMethod('debug'),
  info: createLogMethod('info'),
  warn: createLogMethod('warn'),
  error: createLogMethod('error'),
};

/**
 * Create a scoped logger for a specific module
 * Usage: const log = createLogger('AuthService');
 *        log.info('User logged in');
 */
export function createLogger(context: string) {
  return {
    debug: (message: string, data?: unknown) => logger.debug(message, data, context),
    info: (message: string, data?: unknown) => logger.info(message, data, context),
    warn: (message: string, data?: unknown) => logger.warn(message, data, context),
    error: (message: string, data?: unknown) => logger.error(message, data, context),
  };
}

export default logger;

/**
 * Install global console suppression for production.
 * Call once in main.tsx before app renders.
 *
 * In production:
 * - console.log -> suppressed (no-op)
 * - console.debug -> suppressed (no-op)
 * - console.warn -> kept (important warnings)
 * - console.error -> kept (important errors)
 *
 * In development: all console methods remain unchanged.
 */
export function installLogger() {
  if (!isDev) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.log = () => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.debug = () => {};
  }
}
