import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { 
  getPollutantName, 
  formatPollutantValue, 
  getPollutantColor,
  calculateAQI 
} from '../utils/airQuality';

export function PollutantCard({ pollutant, value, previousValue, className = '' }) {
  const name = getPollutantName(pollutant);
  const formattedValue = formatPollutantValue(pollutant, value);
  const color = getPollutantColor(pollutant, value);
  const aqiData = calculateAQI(pollutant, value);

  // Calculate trend
  let trend = 'stable';
  let trendPercent = 0;
  if (previousValue !== undefined && previousValue !== null) {
    const diff = value - previousValue;
    trendPercent = previousValue > 0 ? (diff / previousValue) * 100 : 0;
    if (Math.abs(trendPercent) > 5) {
      trend = diff > 0 ? 'up' : 'down';
    }
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-400';

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-gray-600">{name}</h4>
          <div className="text-2xl font-bold text-gray-900 mt-1">{formattedValue}</div>
        </div>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
          aria-label={`Status: ${aqiData?.label || 'Unknown'}`}
        />
      </div>

      {aqiData && (
        <div className="mb-2">
          <div className="text-xs text-gray-500">AQI: {aqiData.aqi}</div>
          <div className="text-xs font-medium" style={{ color }}>
            {aqiData.label}
          </div>
        </div>
      )}

      {previousValue !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span>
            {Math.abs(trendPercent).toFixed(1)}%
            {trend === 'stable' ? ' stable' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
