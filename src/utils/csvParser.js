import Papa from 'papaparse';

/**
 * Parse CSV file for device import
 * Expected format: deviceId,name,lat,lng,status,type
 */
export function parseDeviceCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const devices = results.data.map((row, index) => {
            const lat = parseFloat(row.lat || row.latitude);
            const lng = parseFloat(row.lng || row.longitude);

            if (isNaN(lat) || isNaN(lng)) {
              throw new Error(`Invalid coordinates at row ${index + 1}`);
            }

            return {
              id: row.deviceId || row.id || `imported-${Date.now()}-${index}`,
              name: row.name || `Device ${index + 1}`,
              lat,
              lng,
              status: row.status || 'active',
              type: row.type || 'air-quality-sensor',
              location: row.location || 'Unknown',
              installDate: row.installDate || new Date().toISOString(),
            };
          });

          resolve(devices);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * Export devices to CSV format
 */
export function exportDevicesToCSV(devices) {
  const csv = Papa.unparse(devices.map(d => ({
    deviceId: d.id,
    name: d.name,
    lat: d.lat,
    lng: d.lng,
    status: d.status,
    type: d.type,
    location: d.location,
    installDate: d.installDate,
  })));

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `airmap-devices-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
