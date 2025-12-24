import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LogEntry {
  id: string;
  type: 'info' | 'error' | 'warning' | 'api';
  message: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

// Sensitive keys to always redact
const SENSITIVE_KEYS = [
  'password', 'apikey', 'api_key', 'token', 'auth', 'secret', 
  'access_token', 'refresh_token', 'bearer', 'credential', 'private_key',
  'session', 'cookie', 'authorization', 'key', 'jwt'
];

const LogCenter = () => {
  // Store logs in memory only - not persisted to localStorage for security
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const originalConsolesRef = useRef<{
    log: typeof console.log;
    error: typeof console.error;
    warn: typeof console.warn;
  } | null>(null);

  const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
      // Redact values that look like tokens/keys (long alphanumeric strings)
      if (value.length > 20 && /^[a-zA-Z0-9_-]+$/.test(value)) {
        return '[REDACTED]';
      }
      // Redact email addresses
      if (/\S+@\S+\.\S+/.test(value)) {
        return '[EMAIL_REDACTED]';
      }
      return value.substring(0, 500); // Truncate long strings
    }
    return value;
  };

  const sanitizeObject = (obj: unknown, depth = 0): unknown => {
    if (depth > 3) return '[MAX_DEPTH]'; // Prevent deep recursion
    
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj !== 'object') {
      return sanitizeValue(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.slice(0, 10).map(item => sanitizeObject(item, depth + 1));
    }
    
    const sanitized: Record<string, unknown> = {};
    const entries = Object.entries(obj as Record<string, unknown>);
    
    for (const [key, value] of entries.slice(0, 20)) { // Limit keys
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeObject(value, depth + 1);
      }
    }
    
    return sanitized;
  };

  const addLog = (type: LogEntry['type'], message: string, details?: unknown) => {
    const sanitizedMessage = typeof message === 'string' 
      ? message.substring(0, 500) 
      : String(message).substring(0, 500);
    
    const newLog: LogEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message: sanitizedMessage,
      timestamp: Date.now(),
      details: details ? sanitizeObject(details) as Record<string, unknown> : undefined,
    };

    setLogs((prev) => {
      // Keep only last 200 logs in memory
      return [newLog, ...prev].slice(0, 200);
    });
  };

  useEffect(() => {
    // Store original console methods
    originalConsolesRef.current = {
      log: console.log.bind(console),
      error: console.error.bind(console),
      warn: console.warn.bind(console),
    };

    const originals = originalConsolesRef.current;

    // Intercept console methods
    console.log = (...args: unknown[]) => {
      originals.log(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      addLog('info', message);
    };

    console.error = (...args: unknown[]) => {
      originals.error(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      addLog('error', message);
    };

    console.warn = (...args: unknown[]) => {
      originals.warn(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      addLog('warning', message);
    };

    return () => {
      // Restore original methods
      if (originalConsolesRef.current) {
        console.log = originalConsolesRef.current.log;
        console.error = originalConsolesRef.current.error;
        console.warn = originalConsolesRef.current.warn;
      }
    };
  }, []);

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      setLogs([]);
    }
  };

  const exportLogs = () => {
    // Additional sanitization pass before export
    const sanitizedLogs = logs.map(log => ({
      ...log,
      details: log.details ? sanitizeObject(log.details) : undefined,
    }));
    
    const dataStr = JSON.stringify(sanitizedLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `onyxgpt-logs-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'api':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <div className="max-w-6xl mx-auto p-3 md:p-6 h-full flex flex-col">
        <div className="space-y-2 mb-4">
          <h1 className="text-3xl font-bold">Log Center</h1>
          <p className="text-muted-foreground">View application logs, errors, and API requests (stored in memory only)</p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Logs ({logs.length})</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="api">API Requests</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportLogs}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={clearLogs}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Logs */}
          <ScrollArea className="flex-1 p-4">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p className="text-lg">No logs yet</p>
                <p className="text-sm mt-2">Application logs will appear here (memory only, not persisted)</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getTypeColor(log.type)} className="text-xs">
                            {log.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm break-words font-mono">{log.message}</p>
                        {log.details && typeof log.details === 'object' && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                              View Details
                            </summary>
                            <pre className="mt-2 text-xs bg-background/50 p-2 rounded overflow-auto max-h-48">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default LogCenter;
