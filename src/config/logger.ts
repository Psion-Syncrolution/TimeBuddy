/**
 * Minimaler, strukturierter Logger fuer Server-seitigen Code.
 * Respektiert NODE_ENV: in Produktion nur warn/error.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function activeLevel(): LogLevel {
  if (process.env.NODE_ENV === 'production') return 'warn';
  return 'debug';
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[activeLevel()]) return;

  const entry = {
    level,
    time: new Date().toISOString(),
    message,
    ...(meta ? { meta } : {}),
  };

  const line = JSON.stringify(entry);
  switch (level) {
    case 'error':
      console.error(line);
      break;
    case 'warn':
      console.warn(line);
      break;
    default:
      console.log(line);
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
};
