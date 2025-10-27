import { Marker, Popup, Tooltip } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { divIcon } from 'leaflet';
import { renderToString } from 'react-dom/server';
import { MapPin } from 'lucide-react';
import { getOverallAQI, formatPollutantValue } from '../../utils/airQuality';
import { formatRelativeTime } from '../../utils/dateUtils';

function MarkerIcon({ color, isActive }) {
  return (
    <div 
      className={`relative ${isActive ? 'animate-pulse-slow' : ''}`}
      style={{ width: '32px', height: '32px' }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: color,
          opacity: 0.3,
          transform: 'scale(1.5)',
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundColor: color,
          borderRadius: '50%',
          border: '3px solid white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        <MapPin className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}

export function DeviceMarker({ device, reading, isActive = false }) {
  const aqiData = reading ? getOverallAQI(reading.readings) : null;
  const color = aqiData ? aqiData.color : '#999999';

  const icon = divIcon({
    html: renderToString(<MarkerIcon color={color} isActive={isActive} />),
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <Marker position={[device.lat, device.lng]} icon={icon}>
      <Tooltip direction="top" offset={[0, -20]}>
        <div className="text-sm">
          <div className="font-semibold">{device.name}</div>
          {aqiData && (
            <div className="text-xs" style={{ color }}>
              AQI: {aqiData.aqi} - {aqiData.label}
            </div>
          )}
        </div>
      </Tooltip>
      
      <Popup maxWidth={300}>
        <div className="p-2">
          <h3 className="font-bold text-lg mb-2">{device.name}</h3>
          
          {reading ? (
            <>
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-semibold">
                    AQI: {aqiData.aqi} - {aqiData.label}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {reading.readings.pm25 !== undefined && (
                    <div>
                      <div className="text-gray-600">PM2.5</div>
                      <div className="font-medium">
                        {formatPollutantValue('pm25', reading.readings.pm25)}
                      </div>
                    </div>
                  )}
                  {reading.readings.pm10 !== undefined && (
                    <div>
                      <div className="text-gray-600">PM10</div>
                      <div className="font-medium">
                        {formatPollutantValue('pm10', reading.readings.pm10)}
                      </div>
                    </div>
                  )}
                  {reading.readings.co !== undefined && (
                    <div>
                      <div className="text-gray-600">CO</div>
                      <div className="font-medium">
                        {formatPollutantValue('co', reading.readings.co)}
                      </div>
                    </div>
                  )}
                  {reading.readings.no2 !== undefined && (
                    <div>
                      <div className="text-gray-600">NO₂</div>
                      <div className="font-medium">
                        {formatPollutantValue('no2', reading.readings.no2)}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  Updated {formatRelativeTime(reading.timestamp)}
                </div>
              </div>
              
              <Link
                to={`/devices/${device.id}`}
                className="block w-full text-center bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                View Details
              </Link>
            </>
          ) : (
            <div className="text-gray-500 text-sm mb-3">No recent data</div>
          )}
          
          <div className="text-xs text-gray-600 mt-2">
            <div>ID: {device.id}</div>
            <div>Location: {device.location || 'Unknown'}</div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
