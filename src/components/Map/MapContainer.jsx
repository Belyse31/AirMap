import { MapContainer as LeafletMap, TileLayer, ZoomControl } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_CENTER = [
  parseFloat(import.meta.env.VITE_DEFAULT_LAT) || -1.9536,
  parseFloat(import.meta.env.VITE_DEFAULT_LNG) || 30.0606,
];
const DEFAULT_ZOOM = parseInt(import.meta.env.VITE_DEFAULT_ZOOM) || 12;

export function MapContainer({ 
  children, 
  center = DEFAULT_CENTER, 
  zoom = DEFAULT_ZOOM,
  className = '',
  onMapReady,
  ...props 
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && onMapReady) {
      onMapReady(mapRef.current);
    }
  }, [onMapReady]);

  return (
    <div className={`relative ${className}`}>
      <LeafletMap
        ref={mapRef}
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="w-full h-full rounded-lg"
        {...props}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        {children}
      </LeafletMap>
    </div>
  );
}
