import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export function HeatmapLayer({ points, options = {} }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    // Convert points to format: [lat, lng, intensity]
    const heatPoints = points.map(point => [
      point.lat,
      point.lng,
      point.intensity || 0.5,
    ]);

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 35,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: '#00e400',
        0.2: '#ffff00',
        0.4: '#ff7e00',
        0.6: '#ff0000',
        0.8: '#8f3f97',
        1.0: '#7e0023',
      },
      ...options,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);

  return null;
}
