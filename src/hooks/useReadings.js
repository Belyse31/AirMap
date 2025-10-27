import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { readingsAPI } from '../services/api';
import { loadReadings, saveReadings } from '../utils/localStorage';

const POLLING_INTERVAL = parseInt(import.meta.env.VITE_POLLING_INTERVAL) || 30000;

/**
 * Custom hook for managing sensor readings with real-time updates
 */
export function useReadings(deviceId = null, useRealtime = true) {
  const [readings, setReadings] = useState([]);
  const [latestReadings, setLatestReadings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback((data) => {
    if (data.type === 'reading') {
      const reading = data.payload;
      
      // Add to readings array
      setReadings(prev => {
        const updated = [...prev, reading];
        // Keep only last 1000 readings for performance
        const limited = updated.slice(-1000);
        saveReadings(limited);
        return limited;
      });

      // Update latest readings map
      setLatestReadings(prev => ({
        ...prev,
        [reading.deviceId]: reading,
      }));
    }
  }, []);

  // WebSocket connection
  const { isConnected } = useWebSocket(handleWebSocketMessage, useRealtime);

  // Fetch initial readings
  const fetchReadings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data;
      if (deviceId) {
        data = await readingsAPI.getByDevice(deviceId);
      } else {
        data = await readingsAPI.getRecent(100);
      }

      setReadings(data);
      saveReadings(data);

      // Build latest readings map
      const latest = {};
      data.forEach(reading => {
        if (!latest[reading.deviceId] || reading.timestamp > latest[reading.deviceId].timestamp) {
          latest[reading.deviceId] = reading;
        }
      });
      setLatestReadings(latest);
    } catch (err) {
      console.warn('Failed to fetch readings from API, using localStorage:', err);
      
      // Fallback to localStorage
      const cached = loadReadings();
      if (cached && cached.length > 0) {
        const filtered = deviceId 
          ? cached.filter(r => r.deviceId === deviceId)
          : cached;
        
        setReadings(filtered);

        const latest = {};
        filtered.forEach(reading => {
          if (!latest[reading.deviceId] || reading.timestamp > latest[reading.deviceId].timestamp) {
            latest[reading.deviceId] = reading;
          }
        });
        setLatestReadings(latest);
      } else {
        setError('No readings found');
      }
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  // Polling fallback when WebSocket is not connected
  useEffect(() => {
    if (!useRealtime || isConnected) return;

    const interval = setInterval(() => {
      fetchReadings();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [useRealtime, isConnected, fetchReadings]);

  // Initial fetch
  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  // Get readings for specific device
  const getDeviceReadings = useCallback((devId) => {
    return readings.filter(r => r.deviceId === devId);
  }, [readings]);

  // Get latest reading for device
  const getLatestReading = useCallback((devId) => {
    return latestReadings[devId] || null;
  }, [latestReadings]);

  return {
    readings,
    latestReadings,
    loading,
    error,
    isConnected,
    getDeviceReadings,
    getLatestReading,
    refresh: fetchReadings,
  };
}
