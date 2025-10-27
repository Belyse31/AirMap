import { getOverallAQI, getHealthRecommendation } from '../utils/airQuality';
import clsx from 'clsx';

export function AQIIndicator({ readings, size = 'md', showLabel = true, showValue = true }) {
  const aqiData = getOverallAQI(readings);

  if (!aqiData) {
    return (
      <div className="text-gray-400 text-sm">
        No data
      </div>
    );
  }

  const sizes = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-3xl',
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={clsx(
          'rounded-full flex items-center justify-center font-bold text-white shadow-lg',
          sizes[size]
        )}
        style={{ backgroundColor: aqiData.color }}
        aria-label={`Air Quality Index: ${aqiData.aqi}`}
      >
        {showValue && aqiData.aqi}
      </div>
      {showLabel && (
        <div>
          <div className="font-semibold text-gray-900">{aqiData.label}</div>
          <div className="text-sm text-gray-600">AQI {aqiData.aqi}</div>
        </div>
      )}
    </div>
  );
}

export function AQICard({ readings }) {
  const aqiData = getOverallAQI(readings);

  if (!aqiData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">No air quality data available</p>
      </div>
    );
  }

  const recommendation = getHealthRecommendation(aqiData.aqi);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Air Quality Index</h3>
      
      <div className="flex items-center gap-4 mb-4">
        <AQIIndicator readings={readings} size="lg" showLabel={false} />
        <div>
          <div className="text-3xl font-bold text-gray-900">{aqiData.aqi}</div>
          <div className="text-lg font-medium" style={{ color: aqiData.color }}>
            {aqiData.label}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Health Recommendation</h4>
        <p className="text-sm text-gray-700">{recommendation}</p>
      </div>
    </div>
  );
}
