/**
 * API service for communicating with the mock backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Device API methods
 */
export const deviceAPI = {
  // Get all devices
  getAll: () => fetchAPI('/devices'),

  // Get single device by ID
  getById: (id) => fetchAPI(`/devices/${id}`),

  // Create new device
  create: (device) => fetchAPI('/devices', {
    method: 'POST',
    body: JSON.stringify(device),
  }),

  // Update device
  update: (id, device) => fetchAPI(`/devices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(device),
  }),

  // Delete device
  delete: (id) => fetchAPI(`/devices/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * Readings API methods
 */
export const readingsAPI = {
  // Get recent readings for all devices
  getRecent: (limit = 100) => fetchAPI(`/readings?limit=${limit}`),

  // Get readings for specific device
  getByDevice: (deviceId, hours = 24) => fetchAPI(`/readings/${deviceId}?hours=${hours}`),

  // Get readings in time range
  getByTimeRange: (start, end) => {
    const params = new URLSearchParams({
      start: start.toISOString(),
      end: end.toISOString(),
    });
    return fetchAPI(`/readings/range?${params}`);
  },

  // Submit manual reading
  submit: (reading) => fetchAPI('/readings', {
    method: 'POST',
    body: JSON.stringify(reading),
  }),
};

/**
 * Analytics API methods
 */
export const analyticsAPI = {
  // Get aggregate statistics
  getStats: () => fetchAPI('/analytics/stats'),

  // Get averages by area
  getAreaAverages: () => fetchAPI('/analytics/areas'),

  // Get peak pollution times
  getPeakTimes: () => fetchAPI('/analytics/peaks'),

  // Get top polluted locations
  getTopPolluted: (limit = 10) => fetchAPI(`/analytics/top-polluted?limit=${limit}`),
};

/**
 * Contact form submission
 */
export const contactAPI = {
  submit: (formData) => fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  }),
};
