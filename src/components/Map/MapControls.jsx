import { Layers, Activity } from 'lucide-react';
import { useState } from 'react';

export function MapControls({ 
  layers, 
  onLayerToggle, 
  showHeatmap, 
  onHeatmapToggle,
  selectedPollutant,
  onPollutantChange 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const pollutants = [
    { id: 'pm25', label: 'PM2.5', color: '#3b82f6' },
    { id: 'pm10', label: 'PM10', color: '#8b5cf6' },
    { id: 'co', label: 'CO', color: '#f59e0b' },
    { id: 'no2', label: 'NO₂', color: '#ef4444' },
  ];

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors w-full"
        aria-label="Toggle map controls"
        aria-expanded={isOpen}
      >
        <Layers className="w-5 h-5 text-gray-700" />
        <span className="font-medium text-gray-700">Map Layers</span>
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 p-4 space-y-4 min-w-[200px]">
          {/* Heatmap Toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => onHeatmapToggle(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <Activity className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Heatmap</span>
            </label>
          </div>

          {/* Pollutant Selection */}
          {showHeatmap && (
            <div className="pl-6 space-y-2">
              <div className="text-xs font-medium text-gray-600 mb-2">Pollutant</div>
              {pollutants.map(pollutant => (
                <label key={pollutant.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pollutant"
                    value={pollutant.id}
                    checked={selectedPollutant === pollutant.id}
                    onChange={(e) => onPollutantChange(e.target.value)}
                    className="w-3 h-3 text-primary-600 focus:ring-primary-500"
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pollutant.color }}
                  />
                  <span className="text-sm text-gray-700">{pollutant.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* Additional Layers */}
          {layers && layers.length > 0 && (
            <div className="border-t border-gray-200 pt-3 space-y-2">
              {layers.map(layer => (
                <label key={layer.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={(e) => onLayerToggle(layer.id, e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{layer.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
