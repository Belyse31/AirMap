import { useState, useEffect, useCallback } from 'react';
import { deviceAPI } from '../services/api';
import { loadDevices, saveDevices } from '../utils/localStorage';

/**
 * Custom hook for managing devices with localStorage fallback
 */
export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load devices from API or localStorage
  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from API
      const data = await deviceAPI.getAll();
      setDevices(data);
      saveDevices(data); // Cache in localStorage
    } catch (err) {
      console.warn('Failed to fetch from API, using localStorage:', err);
      
      // Fallback to localStorage
      const cached = loadDevices();
      if (cached) {
        setDevices(cached);
      } else {
        setError('No devices found');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new device
  const addDevice = useCallback(async (device) => {
    try {
      const newDevice = await deviceAPI.create(device);
      setDevices(prev => [...prev, newDevice]);
      saveDevices([...devices, newDevice]);
      return newDevice;
    } catch (err) {
      // Fallback to localStorage
      const newDevice = {
        ...device,
        id: device.id || `device-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setDevices(prev => [...prev, newDevice]);
      saveDevices([...devices, newDevice]);
      return newDevice;
    }
  }, [devices]);

  // Update device
  const updateDevice = useCallback(async (id, updates) => {
    try {
      const updated = await deviceAPI.update(id, updates);
      setDevices(prev => prev.map(d => d.id === id ? updated : d));
      const newDevices = devices.map(d => d.id === id ? updated : d);
      saveDevices(newDevices);
      return updated;
    } catch (err) {
      // Fallback to localStorage
      const updated = { ...devices.find(d => d.id === id), ...updates };
      setDevices(prev => prev.map(d => d.id === id ? updated : d));
      const newDevices = devices.map(d => d.id === id ? updated : d);
      saveDevices(newDevices);
      return updated;
    }
  }, [devices]);

  // Delete device
  const deleteDevice = useCallback(async (id) => {
    try {
      await deviceAPI.delete(id);
      setDevices(prev => prev.filter(d => d.id !== id));
      const newDevices = devices.filter(d => d.id !== id);
      saveDevices(newDevices);
    } catch (err) {
      // Fallback to localStorage
      setDevices(prev => prev.filter(d => d.id !== id));
      const newDevices = devices.filter(d => d.id !== id);
      saveDevices(newDevices);
    }
  }, [devices]);

  // Get device by ID
  const getDevice = useCallback((id) => {
    return devices.find(d => d.id === id);
  }, [devices]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    loading,
    error,
    addDevice,
    updateDevice,
    deleteDevice,
    getDevice,
    refresh: fetchDevices,
  };
}
