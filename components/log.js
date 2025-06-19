// Simple web-based logger using localStorage
// No native dependencies (Platform or FileSystem) needed

const LOG_KEY = 'appLogs';

/**
 * Append a message to the log (persisted in localStorage) and print to console.
 * @param {string} message
 */
export function logToFile(message) {
  try {
    const existing = localStorage.getItem(LOG_KEY) || '';
    const updated = existing + message + '\n';
    localStorage.setItem(LOG_KEY, updated);
    console.log(message);
  } catch (err) {
    console.error('Error logging to file:', err);
  }
}

/**
 * Read all logs from localStorage.
 * @returns {string|null}
 */
export function readLogs() {
  try {
    const logs = localStorage.getItem(LOG_KEY);
    console.log('Logs from storage:', logs);
    return logs;
  } catch (err) {
    console.error('Error reading logs:', err);
    return null;
  }
}

/**
 * Clear all logs from localStorage.
 */
export function clearLogs() {
  try {
    localStorage.removeItem(LOG_KEY);
    console.log('Logs cleared');
  } catch (err) {
    console.error('Error clearing logs:', err);
  }
}
