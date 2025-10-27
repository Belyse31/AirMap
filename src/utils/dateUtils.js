import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Format timestamp to readable date string
 */
export function formatDate(timestamp, formatString = 'PPpp') {
  const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
  return isValid(date) ? format(date, formatString) : 'Invalid date';
}

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp) {
  const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : 'Unknown';
}

/**
 * Format timestamp for chart display
 */
export function formatChartTime(timestamp) {
  return formatDate(timestamp, 'HH:mm');
}

/**
 * Format timestamp for chart date
 */
export function formatChartDate(timestamp) {
  return formatDate(timestamp, 'MMM dd');
}

/**
 * Check if timestamp is recent (within last N minutes)
 */
export function isRecent(timestamp, minutes = 5) {
  const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  return diff < minutes * 60 * 1000;
}

/**
 * Get time range for historical data
 */
export function getTimeRange(hours = 24) {
  const end = new Date();
  const start = new Date(end.getTime() - hours * 60 * 60 * 1000);
  return { start, end };
}
