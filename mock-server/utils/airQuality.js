/**
 * Air Quality Index (AQI) calculation utilities
 */

// AQI breakpoints for PM2.5 (μg/m³)
const PM25_BREAKPOINTS = [
  { min: 0, max: 12, aqiMin: 0, aqiMax: 50, label: 'Good', color: '#00e400' },
  { min: 12.1, max: 35.4, aqiMin: 51, aqiMax: 100, label: 'Moderate', color: '#ffff00' },
  { min: 35.5, max: 55.4, aqiMin: 101, aqiMax: 150, label: 'Unhealthy for Sensitive Groups', color: '#ff7e00' },
  { min: 55.5, max: 150.4, aqiMin: 151, aqiMax: 200, label: 'Unhealthy', color: '#ff0000' },
  { min: 150.5, max: 250.4, aqiMin: 201, aqiMax: 300, label: 'Very Unhealthy', color: '#8f3f97' },
  { min: 250.5, max: 500, aqiMin: 301, aqiMax: 500, label: 'Hazardous', color: '#7e0023' },
];

// AQI breakpoints for PM10 (μg/m³)
const PM10_BREAKPOINTS = [
  { min: 0, max: 54, aqiMin: 0, aqiMax: 50, label: 'Good', color: '#00e400' },
  { min: 55, max: 154, aqiMin: 51, aqiMax: 100, label: 'Moderate', color: '#ffff00' },
  { min: 155, max: 254, aqiMin: 101, aqiMax: 150, label: 'Unhealthy for Sensitive Groups', color: '#ff7e00' },
  { min: 255, max: 354, aqiMin: 151, aqiMax: 200, label: 'Unhealthy', color: '#ff0000' },
  { min: 355, max: 424, aqiMin: 201, aqiMax: 300, label: 'Very Unhealthy', color: '#8f3f97' },
  { min: 425, max: 604, aqiMin: 301, aqiMax: 500, label: 'Hazardous', color: '#7e0023' },
];

const CO_BREAKPOINTS = [
  { min: 0, max: 4.4, aqiMin: 0, aqiMax: 50, label: 'Good', color: '#00e400' },
  { min: 4.5, max: 9.4, aqiMin: 51, aqiMax: 100, label: 'Moderate', color: '#ffff00' },
  { min: 9.5, max: 12.4, aqiMin: 101, aqiMax: 150, label: 'Unhealthy for Sensitive Groups', color: '#ff7e00' },
  { min: 12.5, max: 15.4, aqiMin: 151, aqiMax: 200, label: 'Unhealthy', color: '#ff0000' },
  { min: 15.5, max: 30.4, aqiMin: 201, aqiMax: 300, label: 'Very Unhealthy', color: '#8f3f97' },
  { min: 30.5, max: 50, aqiMin: 301, aqiMax: 500, label: 'Hazardous', color: '#7e0023' },
];

const NO2_BREAKPOINTS = [
  { min: 0, max: 53, aqiMin: 0, aqiMax: 50, label: 'Good', color: '#00e400' },
  { min: 54, max: 100, aqiMin: 51, aqiMax: 100, label: 'Moderate', color: '#ffff00' },
  { min: 101, max: 360, aqiMin: 101, aqiMax: 150, label: 'Unhealthy for Sensitive Groups', color: '#ff7e00' },
  { min: 361, max: 649, aqiMin: 151, aqiMax: 200, label: 'Unhealthy', color: '#ff0000' },
  { min: 650, max: 1249, aqiMin: 201, aqiMax: 300, label: 'Very Unhealthy', color: '#8f3f97' },
  { min: 1250, max: 2049, aqiMin: 301, aqiMax: 500, label: 'Hazardous', color: '#7e0023' },
];

const BREAKPOINT_MAP = {
  pm25: PM25_BREAKPOINTS,
  pm10: PM10_BREAKPOINTS,
  co: CO_BREAKPOINTS,
  no2: NO2_BREAKPOINTS,
};

/**
 * Calculate AQI for a given pollutant value
 */
export function calculateAQI(pollutant, value) {
  const breakpoints = BREAKPOINT_MAP[pollutant.toLowerCase()];
  if (!breakpoints) return null;

  const bp = breakpoints.find(b => value >= b.min && value <= b.max);
  if (!bp) {
    return {
      aqi: 500,
      label: 'Hazardous',
      color: '#7e0023',
      category: 'hazardous',
    };
  }

  const aqi = Math.round(
    ((bp.aqiMax - bp.aqiMin) / (bp.max - bp.min)) * (value - bp.min) + bp.aqiMin
  );

  return {
    aqi,
    label: bp.label,
    color: bp.color,
    category: bp.label.toLowerCase().replace(/\s+/g, '-'),
  };
}

/**
 * Get the overall AQI from multiple pollutant readings
 */
export function getOverallAQI(readings) {
  const aqis = [];
  
  if (readings.pm25 !== undefined && readings.pm25 !== null) {
    const result = calculateAQI('pm25', readings.pm25);
    if (result) aqis.push(result);
  }
  if (readings.pm10 !== undefined && readings.pm10 !== null) {
    const result = calculateAQI('pm10', readings.pm10);
    if (result) aqis.push(result);
  }
  if (readings.co !== undefined && readings.co !== null) {
    const result = calculateAQI('co', readings.co);
    if (result) aqis.push(result);
  }
  if (readings.no2 !== undefined && readings.no2 !== null) {
    const result = calculateAQI('no2', readings.no2);
    if (result) aqis.push(result);
  }

  if (aqis.length === 0) return null;

  return aqis.reduce((worst, current) => 
    current.aqi > worst.aqi ? current : worst
  );
}

