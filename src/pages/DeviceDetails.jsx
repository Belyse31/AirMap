import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Activity, RefreshCw } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { useReadings } from '../hooks/useReadings';
import { Button } from '../components/Button';
import { Card, CardHeader } from '../components/Card';
import { StatusBadge } from '../components/Badge';
import { AQICard } from '../components/AQIIndicator';
import { PollutantCard } from '../components/PollutantCard';
import { TimeSeriesChart } from '../components/Charts/TimeSeriesChart';
import { MapContainer } from '../components/Map/MapContainer';
import { DeviceMarker } from '../components/Map/DeviceMarker';
import { PageLoader } from '../components/LoadingSpinner';
import { formatDate } from '../utils/dateUtils';
import { useState } from 'react';

export function DeviceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDevice, loading: deviceLoading } = useDevices();
  const { getDeviceReadings, getLatestReading, loading: readingsLoading } = useReadings();
  
  const [simulatingReading, setSimulatingReading] = useState(false);

  const device = getDevice(id);
  const readings = getDeviceReadings(id);
  const latestReading = getLatestReading(id);

  const loading = deviceLoading || readingsLoading;

  // Simulate manual reading
  const handleSimulateReading = async () => {
    setSimulatingReading(true);
    // In a real app, this would trigger the device to take a reading
    setTimeout(() => {
      setSimulatingReading(false);
      alert('Manual reading triggered. New data will appear shortly.');
    }, 2000);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!device) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Device Not Found</h2>
              <p className="text-gray-600 mb-6">The device you're looking for doesn't exist.</p>
              <Link to="/devices">
                <Button variant="primary">Back to Device Hub</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Prepare chart data (last 24 hours)
  const chartData = readings
    .slice(-48)
    .map(r => ({
      timestamp: r.timestamp,
      pm25: r.readings.pm25,
      pm10: r.readings.pm10,
      co: r.readings.co,
      no2: r.readings.no2,
    }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/devices" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Device Hub
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{device.name}</h1>
              <p className="text-gray-600">Device ID: {device.id}</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                icon={RefreshCw}
                onClick={handleSimulateReading}
                loading={simulatingReading}
              >
                Manual Reading
              </Button>
              <Link to={`/devices/${device.id}/edit`}>
                <Button variant="primary">Edit Device</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Device Info & Map */}
          <div className="space-y-6">
            {/* Device Information */}
            <Card>
              <CardHeader title="Device Information" />
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <StatusBadge status={device.status} />
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Location</div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {device.location || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {device.lat.toFixed(4)}, {device.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Type</div>
                  <div className="font-medium text-gray-900">
                    {device.type || 'Air Quality Sensor'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Install Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {formatDate(device.installDate || device.createdAt, 'PP')}
                    </span>
                  </div>
                </div>

                {latestReading && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Last Reading</div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {formatDate(latestReading.timestamp, 'PPpp')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Mini Map */}
            <Card padding={false}>
              <div className="h-64">
                <MapContainer center={[device.lat, device.lng]} zoom={15}>
                  <DeviceMarker device={device} reading={latestReading} isActive />
                </MapContainer>
              </div>
            </Card>
          </div>

          {/* Right Column - Readings & Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* AQI Card */}
            {latestReading && (
              <AQICard readings={latestReading.readings} />
            )}

            {/* Current Pollutant Levels */}
            {latestReading && (
              <Card>
                <CardHeader title="Current Pollutant Levels" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {latestReading.readings.pm25 !== undefined && (
                    <PollutantCard
                      pollutant="pm25"
                      value={latestReading.readings.pm25}
                      previousValue={readings[readings.length - 2]?.readings.pm25}
                    />
                  )}
                  {latestReading.readings.pm10 !== undefined && (
                    <PollutantCard
                      pollutant="pm10"
                      value={latestReading.readings.pm10}
                      previousValue={readings[readings.length - 2]?.readings.pm10}
                    />
                  )}
                  {latestReading.readings.co !== undefined && (
                    <PollutantCard
                      pollutant="co"
                      value={latestReading.readings.co}
                      previousValue={readings[readings.length - 2]?.readings.co}
                    />
                  )}
                  {latestReading.readings.no2 !== undefined && (
                    <PollutantCard
                      pollutant="no2"
                      value={latestReading.readings.no2}
                      previousValue={readings[readings.length - 2]?.readings.no2}
                    />
                  )}
                </div>
              </Card>
            )}

            {/* Historical Trends */}
            {chartData.length > 0 && (
              <Card>
                <CardHeader 
                  title="24-Hour Trend" 
                  subtitle="Historical pollutant levels"
                />
                
                <TimeSeriesChart
                  data={chartData}
                  pollutants={['pm25', 'pm10', 'co', 'no2']}
                  height={350}
                />
              </Card>
            )}

            {/* No Data State */}
            {!latestReading && (
              <Card>
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Data Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This device hasn't reported any readings yet.
                  </p>
                  <Button
                    variant="primary"
                    icon={RefreshCw}
                    onClick={handleSimulateReading}
                    loading={simulatingReading}
                  >
                    Trigger Manual Reading
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
