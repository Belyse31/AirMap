import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ToastContainer } from '../components/Toast';
import { MapContainer } from '../components/Map/MapContainer';
import { Marker, useMapEvents } from 'react-leaflet';

function LocationPicker({ position, onPositionChange }) {
  const [tempPosition, setTempPosition] = useState(position);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const newPos = [e.latlng.lat, e.latlng.lng];
        setTempPosition(newPos);
        onPositionChange(newPos);
      },
    });
    return null;
  };

  return (
    <>
      <MapClickHandler />
      {tempPosition && (
        <Marker
          position={tempPosition}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const newPos = [e.target.getLatLng().lat, e.target.getLatLng().lng];
              setTempPosition(newPos);
              onPositionChange(newPos);
            },
          }}
        />
      )}
    </>
  );
}

export function DeviceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDevice, addDevice, updateDevice } = useDevices();
  const { toasts, removeToast, success, error } = useToast();

  const isEdit = !!id;
  const existingDevice = isEdit ? getDevice(id) : null;

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    lat: -1.9536,
    lng: 30.0606,
    status: 'active',
    type: 'air-quality-sensor',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingDevice) {
      setFormData({
        name: existingDevice.name,
        location: existingDevice.location || '',
        lat: existingDevice.lat,
        lng: existingDevice.lng,
        status: existingDevice.status,
        type: existingDevice.type || 'air-quality-sensor',
      });
    }
  }, [existingDevice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePositionChange = ([lat, lng]) => {
    setFormData(prev => ({ ...prev, lat, lng }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        await updateDevice(id, formData);
        success('Device updated successfully');
      } else {
        const newDevice = await addDevice({
          ...formData,
          id: `device-${Date.now()}`,
          installDate: new Date().toISOString(),
        });
        success('Device added successfully');
        navigate(`/devices/${newDevice.id}`);
        return;
      }
      navigate('/devices');
    } catch (err) {
      error(`Failed to ${isEdit ? 'update' : 'add'} device: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/devices" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Device Hub
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Device' : 'Add New Device'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update device information and location' : 'Register a new air quality sensor'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Device Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Downtown Sensor #1"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location Description
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., City Center, Near Park"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="offline">Offline</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Device Type
                  </label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="air-quality-sensor"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Location Coordinates</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    id="lat"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    step="0.0001"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    id="lng"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                    step="0.0001"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Click on map to set location or drag the marker
                  </label>
                </div>
                <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
                  <MapContainer center={[formData.lat, formData.lng]} zoom={13}>
                    <LocationPicker
                      position={[formData.lat, formData.lng]}
                      onPositionChange={handlePositionChange}
                    />
                  </MapContainer>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link to="/devices">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              loading={submitting}
            >
              {isEdit ? 'Update Device' : 'Add Device'}
            </Button>
          </div>
        </form>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
