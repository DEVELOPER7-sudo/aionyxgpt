interface PuterAPILog {
  method: string;
  model?: string;
  duration: number;
  timestamp: number;
  success: boolean;
}

interface OpenRouterAPILog {
  method: string;
  model: string;
  duration: number;
  timestamp: number;
  success: boolean;
}

interface LogEntry {
  id: string;
  type: 'info' | 'error' | 'warning' | 'api';
  message: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

// In-memory log storage (not persisted for security)
let memoryLogs: LogEntry[] = [];
const MAX_LOGS = 100;

const addLogToMemory = (logEntry: LogEntry) => {
  memoryLogs = [logEntry, ...memoryLogs].slice(0, MAX_LOGS);
};

export const getApiLogs = (): LogEntry[] => {
  return [...memoryLogs];
};

export const clearApiLogs = () => {
  memoryLogs = [];
};

export const logPuterAPICall = (apiLog: PuterAPILog) => {
  const logEntry: LogEntry = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'api',
    message: `Puter API Call: ${apiLog.method}`,
    timestamp: apiLog.timestamp,
    details: {
      method: apiLog.method,
      model: apiLog.model,
      duration: apiLog.duration,
      success: apiLog.success,
    },
  };

  addLogToMemory(logEntry);
};

export const logOpenRouterAPICall = (apiLog: OpenRouterAPILog) => {
  const logEntry: LogEntry = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'api',
    message: `OpenRouter API Call: ${apiLog.model}`,
    timestamp: apiLog.timestamp,
    details: {
      method: apiLog.method,
      model: apiLog.model,
      duration: apiLog.duration,
      success: apiLog.success,
    },
  };

  addLogToMemory(logEntry);
};

export const createPuterAPILogger = () => {
  const startTime = Date.now();
  
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logSuccess: (method: string, params?: any, _response?: any) => {
      logPuterAPICall({
        method,
        model: params?.model,
        duration: Date.now() - startTime,
        timestamp: startTime,
        success: true,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logError: (method: string, params?: any, _error?: any) => {
      logPuterAPICall({
        method,
        model: params?.model,
        duration: Date.now() - startTime,
        timestamp: startTime,
        success: false,
      });
    },
  };
};

export const createOpenRouterAPILogger = () => {
  const startTime = Date.now();
  
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logSuccess: (model: string, _params?: any, _response?: any) => {
      logOpenRouterAPICall({
        method: 'chat.completions',
        model,
        duration: Date.now() - startTime,
        timestamp: startTime,
        success: true,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logError: (model: string, _params?: any, _error?: any) => {
      logOpenRouterAPICall({
        method: 'chat.completions',
        model,
        duration: Date.now() - startTime,
        timestamp: startTime,
        success: false,
      });
    },
  };
};