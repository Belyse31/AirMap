/**
 * Air Quality Index (AQI) calculation and classification utilities
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

// Simplified breakpoints for other pollutants
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
    // Value exceeds maximum, return hazardous
    return {
      aqi: 500,
      label: 'Hazardous',
      color: '#7e0023',
      category: 'hazardous',
    };
  }

  // Linear interpolation formula
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
  
  if (readings.pm25 !== undefined) {
    const result = calculateAQI('pm25', readings.pm25);
    if (result) aqis.push(result);
  }
  if (readings.pm10 !== undefined) {
    const result = calculateAQI('pm10', readings.pm10);
    if (result) aqis.push(result);
  }
  if (readings.co !== undefined) {
    const result = calculateAQI('co', readings.co);
    if (result) aqis.push(result);
  }
  if (readings.no2 !== undefined) {
    const result = calculateAQI('no2', readings.no2);
    if (result) aqis.push(result);
  }

  if (aqis.length === 0) return null;

  // Return the worst (highest) AQI
  return aqis.reduce((worst, current) => 
    current.aqi > worst.aqi ? current : worst
  );
}

/**
 * Get color for a specific pollutant value
 */
export function getPollutantColor(pollutant, value) {
  const result = calculateAQI(pollutant, value);
  return result ? result.color : '#999999';
}

/**
 * Get health recommendation based on AQI
 */
export function getHealthRecommendation(aqi) {
  if (aqi <= 50) {
    return 'Air quality is satisfactory, and air pollution poses little or no risk.';
  } else if (aqi <= 100) {
    return 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.';
  } else if (aqi <= 150) {
    return 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
  } else if (aqi <= 200) {
    return 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.';
  } else if (aqi <= 300) {
    return 'Health alert: The risk of health effects is increased for everyone.';
  } else {
    return 'Health warning of emergency conditions: everyone is more likely to be affected.';
  }
}

/**
 * Format pollutant value with unit
 */
export function formatPollutantValue(pollutant, value, unit = 'metric') {
  if (value === null || value === undefined) return 'N/A';
  
  const units = {
    pm25: 'μg/m³',
    pm10: 'μg/m³',
    co: 'ppm',
    no2: 'ppb',
  };

  return `${value.toFixed(1)} ${units[pollutant] || ''}`;
}

/**
 * Get pollutant display name
 */
export function getPollutantName(pollutant) {
  const names = {
    pm25: 'PM2.5',
    pm10: 'PM10',
    co: 'CO',
    no2: 'NO₂',
  };
  return names[pollutant] || pollutant.toUpperCase();
}
