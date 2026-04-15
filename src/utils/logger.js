import log from 'loglevel';

const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || 'info';
log.setLevel(LOG_LEVEL);

const buffer = [];
const MAX_BUFFER = 500;

function _push(level, message, component, data) {
  buffer.push({ timestamp: new Date().toISOString(), level, message, component, data });
  if (buffer.length > MAX_BUFFER) buffer.shift();
}

const logger = {
  trace: (message, component = null, data = null) => { log.trace(message); _push('trace', message, component, data); },
  debug: (message, component = null, data = null) => { log.debug(message); _push('debug', message, component, data); },
  info:  (message, component = null, data = null) => { log.info(message);  _push('info',  message, component, data); },
  warn:  (message, component = null, data = null) => { log.warn(message);  _push('warn',  message, component, data); },
  error: (message, component = null, data = null) => { log.error(message); _push('error', message, component, data); },

  getLogs: (level = null, limit = 100) => {
    const filtered = level ? buffer.filter(l => l.level === level) : buffer;
    return filtered.slice(-limit);
  },

  exportLogs: () => ({ logs: [...buffer], exportedAt: new Date().toISOString() }),

  clearLogs: () => { buffer.length = 0; },

  clear: function() { this.clearLogs(); },
};

export default logger;
