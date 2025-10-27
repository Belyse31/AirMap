import { describe, it, expect } from 'vitest';
import { calculateAQI, getOverallAQI, getPollutantColor } from '../airQuality';

describe('airQuality utils', () => {
  describe('calculateAQI', () => {
    it('should calculate AQI for PM2.5', () => {
      const result = calculateAQI('pm25', 12);
      expect(result.aqi).toBe(50);
      expect(result.label).toBe('Good');
    });

    it('should calculate AQI for high PM2.5', () => {
      const result = calculateAQI('pm25', 55.5);
      expect(result.aqi).toBeGreaterThan(150);
      expect(result.label).toBe('Unhealthy');
    });

    it('should return hazardous for extreme values', () => {
      const result = calculateAQI('pm25', 500);
      expect(result.aqi).toBe(500);
      expect(result.label).toBe('Hazardous');
    });
  });

  describe('getOverallAQI', () => {
    it('should return highest AQI from multiple pollutants', () => {
      const readings = {
        pm25: 35, // Moderate
        pm10: 60, // Moderate
        co: 0.5,  // Good
        no2: 15,  // Good
      };

      const result = getOverallAQI(readings);
      expect(result).toBeTruthy();
      expect(result.aqi).toBeGreaterThan(50);
    });

    it('should handle missing pollutants', () => {
      const readings = { pm25: 10 };
      const result = getOverallAQI(readings);
      expect(result).toBeTruthy();
      expect(result.label).toBe('Good');
    });
  });

  describe('getPollutantColor', () => {
    it('should return green for good air quality', () => {
      const color = getPollutantColor('pm25', 10);
      expect(color).toBe('#00e400');
    });

    it('should return red for unhealthy air quality', () => {
      const color = getPollutantColor('pm25', 60);
      expect(color).toBe('#ff0000');
    });
  });
});
