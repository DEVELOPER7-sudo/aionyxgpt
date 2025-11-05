interface PuterAPILog {
  method: string;
  params: {
    prompt?: string;
    imageUrl?: string;
    messages?: any[];
    options?: any;
    model?: string;
  };
  response?: any;
  error?: any;
  duration: number;
  timestamp: number;
}

interface OpenRouterAPILog {
  method: string;
  model: string;
  params: {
    messages?: any[];
    temperature?: number;
    max_tokens?: number;
  };
  response?: any;
  error?: any;
  duration: number;
  timestamp: number;
}

interface LogEntry {
  id: string;
  type: 'info' | 'error' | 'warning' | 'api';
  message: string;
  timestamp: number;
  details?: any;
}

export const logPuterAPICall = (apiLog: PuterAPILog) => {
  const logEntry: LogEntry = {
    id: Date.now().toString(),
    type: 'api',
    message: `Puter API Call: ${apiLog.method}`,
    timestamp: apiLog.timestamp,
    details: apiLog,
  };

  // Get existing logs
  const savedLogs = localStorage.getItem('app_logs');
  const logs: LogEntry[] = savedLogs ? JSON.parse(savedLogs) : [];

  // Add new log
  const updatedLogs = [logEntry, ...logs].slice(0, 500); // Keep last 500 logs
  localStorage.setItem('app_logs', JSON.stringify(updatedLogs));
};

export const logOpenRouterAPICall = (apiLog: OpenRouterAPILog) => {
  const logEntry: LogEntry = {
    id: Date.now().toString(),
    type: 'api',
    message: `OpenRouter API Call: ${apiLog.model}`,
    timestamp: apiLog.timestamp,
    details: apiLog,
  };

  // Get existing logs
  const savedLogs = localStorage.getItem('app_logs');
  const logs: LogEntry[] = savedLogs ? JSON.parse(savedLogs) : [];

  // Add new log
  const updatedLogs = [logEntry, ...logs].slice(0, 500); // Keep last 500 logs
  localStorage.setItem('app_logs', JSON.stringify(updatedLogs));
};

export const createPuterAPILogger = () => {
  const startTime = Date.now();
  
  return {
    logSuccess: (method: string, params: any, response: any) => {
      logPuterAPICall({
        method,
        params,
        response: typeof response === 'string' ? response.substring(0, 500) + '...' : response,
        duration: Date.now() - startTime,
        timestamp: startTime,
      });
    },
    logError: (method: string, params: any, error: any) => {
      logPuterAPICall({
        method,
        params,
        error: error?.message || String(error),
        duration: Date.now() - startTime,
        timestamp: startTime,
      });
    },
  };
};

export const createOpenRouterAPILogger = () => {
  const startTime = Date.now();
  
  return {
    logSuccess: (model: string, params: any, response: any) => {
      logOpenRouterAPICall({
        method: 'chat.completions',
        model,
        params,
        response: typeof response === 'string' ? response.substring(0, 500) + '...' : response,
        duration: Date.now() - startTime,
        timestamp: startTime,
      });
    },
    logError: (model: string, params: any, error: any) => {
      logOpenRouterAPICall({
        method: 'chat.completions',
        model,
        params,
        error: error?.message || String(error),
        duration: Date.now() - startTime,
        timestamp: startTime,
      });
    },
  };
};
