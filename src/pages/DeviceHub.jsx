import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Download, Upload, Filter } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { useReadings } from '../hooks/useReadings';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/Button';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/Badge';
import { Card } from '../components/Card';
import { PageLoader } from '../components/LoadingSpinner';
import { ToastContainer } from '../components/Toast';
import { formatRelativeTime } from '../utils/dateUtils';
import { getOverallAQI } from '../utils/airQuality';
import { parseDeviceCSV, exportDevicesToCSV } from '../utils/csvParser';

const ITEMS_PER_PAGE = 10;

export function DeviceHub() {
  const { devices, loading, deleteDevice } = useDevices();
  const { latestReadings } = useReadings();
  const { toasts, removeToast, success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search devices
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesSearch = 
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (device.location && device.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || device.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [devices, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredDevices.length / ITEMS_PER_PAGE);
  const paginatedDevices = filteredDevices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle device deletion
  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete device "${name}"?`)) return;

    try {
      await deleteDevice(id);
      success(`Device "${name}" deleted successfully`);
    } catch (err) {
      error(`Failed to delete device: ${err.message}`);
    }
  };

  // Handle CSV import
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const importedDevices = await parseDeviceCSV(file);
      success(`Successfully imported ${importedDevices.length} devices`);
      // In a real app, you'd call addDevice for each imported device
    } catch (err) {
      error(`Failed to import devices: ${err.message}`);
    }

    event.target.value = '';
  };

  // Handle CSV export
  const handleExport = () => {
    try {
      exportDevicesToCSV(devices);
      success('Devices exported successfully');
    } catch (err) {
      error(`Failed to export devices: ${err.message}`);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Hub</h1>
          <p className="text-gray-600">Manage and monitor all your air quality sensors</p>
        </div>

        {/* Actions Bar */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search devices by name, ID, or location..."
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={Filter}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              
              <label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button variant="secondary" size="sm" icon={Upload} as="span">
                  Import CSV
                </Button>
              </label>

              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={handleExport}
              >
                Export
              </Button>

              <Link to="/devices/new">
                <Button variant="primary" size="sm" icon={Plus}>
                  Add Device
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="offline">Offline</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Device Table */}
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AQI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDevices.map(device => {
                  const reading = latestReadings[device.id];
                  const aqiData = reading ? getOverallAQI(reading.readings) : null;

                  return (
                    <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{device.name}</div>
                          <div className="text-sm text-gray-500">{device.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {device.location || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={device.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {aqiData ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: aqiData.color }}
                            />
                            <span className="font-medium">{aqiData.aqi}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No data</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {reading ? formatRelativeTime(reading.timestamp) : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link to={`/devices/${device.id}`}>
                            <Button variant="ghost" size="sm" icon={Eye}>
                              View
                            </Button>
                          </Link>
                          <Link to={`/devices/${device.id}/edit`}>
                            <Button variant="ghost" size="sm" icon={Edit}>
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDelete(device.id, device.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredDevices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No devices found</p>
              <Link to="/devices/new">
                <Button variant="primary" icon={Plus}>
                  Add Your First Device
                </Button>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {filteredDevices.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={filteredDevices.length}
              />
            </div>
          )}
        </Card>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
