/**
 * LocalStorage utilities for demo data persistence
 */

const STORAGE_KEYS = {
  DEVICES: 'airmap_devices',
  READINGS: 'airmap_readings',
  SETTINGS: 'airmap_settings',
};

/**
 * Save devices to localStorage
 */
export function saveDevices(devices) {
  try {
    localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
    return true;
  } catch (error) {
    console.error('Failed to save devices:', error);
    return false;
  }
}

/**
 * Load devices from localStorage
 */
export function loadDevices() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DEVICES);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load devices:', error);
    return null;
  }
}

/**
 * Save readings to localStorage (limited to last 1000 for performance)
 */
export function saveReadings(readings) {
  try {
    const limited = readings.slice(-1000);
    localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(limited));
    return true;
  } catch (error) {
    console.error('Failed to save readings:', error);
    return false;
  }
}

/**
 * Load readings from localStorage
 */
export function loadReadings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.READINGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load readings:', error);
    return [];
  }
}

/**
 * Save user settings
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
}

/**
 * Load user settings
 */
export function loadSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      units: 'metric',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      theme: 'light',
    };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return {
      units: 'metric',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      theme: 'light',
    };
  }
}

/**
 * Clear all app data
 */
export function clearAllData() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to clear data:', error);
    return false;
  }
}
