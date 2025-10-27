import { useState, useMemo } from 'react';
import { MapContainer } from '../components/Map/MapContainer';
import { DeviceMarker } from '../components/Map/DeviceMarker';
import { HeatmapLayer } from '../components/Map/HeatmapLayer';
import { MapControls } from '../components/Map/MapControls';
import { useDevices } from '../hooks/useDevices';
import { useReadings } from '../hooks/useReadings';
import { PageLoader } from '../components/LoadingSpinner';
import { calculateAQI } from '../utils/airQuality';
import { Slider } from '../components/Slider';
import { Clock } from 'lucide-react';

export function LiveMap() {
  const { devices, loading: devicesLoading } = useDevices();
  const { latestReadings, loading: readingsLoading } = useReadings();
  
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedPollutant, setSelectedPollutant] = useState('pm25');
  const [timeOffset, setTimeOffset] = useState(0); // Hours back from now

  const loading = devicesLoading || readingsLoading;

  // Generate heatmap points
  const heatmapPoints = useMemo(() => {
    if (!showHeatmap) return [];

    return devices
      .map(device => {
        const reading = latestReadings[device.id];
        if (!reading || !reading.readings[selectedPollutant]) return null;

        const value = reading.readings[selectedPollutant];
        const aqiData = calculateAQI(selectedPollutant, value);
        
        // Normalize AQI to 0-1 for heatmap intensity
        const intensity = aqiData ? Math.min(aqiData.aqi / 500, 1) : 0;

        return {
          lat: device.lat,
          lng: device.lng,
          intensity,
        };
      })
      .filter(Boolean);
  }, [devices, latestReadings, showHeatmap, selectedPollutant]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      {/* Map */}
      <MapContainer className="h-full">
        {/* Device Markers */}
        {devices.map(device => (
          <DeviceMarker
            key={device.id}
            device={device}
            reading={latestReadings[device.id]}
            isActive={latestReadings[device.id] !== undefined}
          />
        ))}

        {/* Heatmap Layer */}
        {showHeatmap && <HeatmapLayer points={heatmapPoints} />}
      </MapContainer>

      {/* Map Controls */}
      <MapControls
        showHeatmap={showHeatmap}
        onHeatmapToggle={setShowHeatmap}
        selectedPollutant={selectedPollutant}
        onPollutantChange={setSelectedPollutant}
      />

      {/* Time Slider for Historical View */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg p-4 w-96 max-w-[90vw]">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">
            {timeOffset === 0 ? 'Live Data' : `${timeOffset} hours ago`}
          </span>
        </div>
        <Slider
          min={0}
          max={72}
          value={timeOffset}
          onChange={setTimeOffset}
          label="Time"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Now</span>
          <span>72h ago</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Air Quality Index</h3>
        <div className="space-y-2">
          <LegendItem color="#00e400" label="Good (0-50)" />
          <LegendItem color="#ffff00" label="Moderate (51-100)" />
          <LegendItem color="#ff7e00" label="Unhealthy for Sensitive (101-150)" />
          <LegendItem color="#ff0000" label="Unhealthy (151-200)" />
          <LegendItem color="#8f3f97" label="Very Unhealthy (201-300)" />
          <LegendItem color="#7e0023" label="Hazardous (301+)" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs text-gray-700">{label}</span>
    </div>
  );
}
