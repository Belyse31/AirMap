import { useMemo } from 'react';
import { TrendingUp, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { useReadings } from '../hooks/useReadings';
import { Card, CardHeader } from '../components/Card';
import { PageLoader } from '../components/LoadingSpinner';
import { BarChart } from '../components/Charts/BarChart';
import { PieChart } from '../components/Charts/PieChart';
import { TimeSeriesChart } from '../components/Charts/TimeSeriesChart';
import { getOverallAQI, calculateAQI } from '../utils/airQuality';
import { formatChartDate } from '../utils/dateUtils';

export function Analytics() {
  const { devices, loading: devicesLoading } = useDevices();
  const { readings, latestReadings, loading: readingsLoading } = useReadings();

  const loading = devicesLoading || readingsLoading;

  // Calculate analytics
  const analytics = useMemo(() => {
    // Average AQI by area/location
    const areaAverages = {};
    devices.forEach(device => {
      const reading = latestReadings[device.id];
      if (!reading) return;

      const area = device.location || 'Unknown';
      const aqiData = getOverallAQI(reading.readings);
      
      if (!areaAverages[area]) {
        areaAverages[area] = { total: 0, count: 0 };
      }
      
      areaAverages[area].total += aqiData?.aqi || 0;
      areaAverages[area].count += 1;
    });

    const areaData = Object.entries(areaAverages).map(([name, data]) => ({
      name,
      aqi: Math.round(data.total / data.count),
    }));

    // Top polluted locations
    const topPolluted = devices
      .map(device => {
        const reading = latestReadings[device.id];
        if (!reading) return null;
        
        const aqiData = getOverallAQI(reading.readings);
        return {
          name: device.name,
          aqi: aqiData?.aqi || 0,
          location: device.location,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.aqi - a.aqi)
      .slice(0, 10);

    // Pollutant distribution
    const pollutantCounts = {
      good: 0,
      moderate: 0,
      unhealthy: 0,
      veryUnhealthy: 0,
      hazardous: 0,
    };

    Object.values(latestReadings).forEach(reading => {
      const aqiData = getOverallAQI(reading.readings);
      if (!aqiData) return;

      if (aqiData.aqi <= 50) pollutantCounts.good++;
      else if (aqiData.aqi <= 100) pollutantCounts.moderate++;
      else if (aqiData.aqi <= 200) pollutantCounts.unhealthy++;
      else if (aqiData.aqi <= 300) pollutantCounts.veryUnhealthy++;
      else pollutantCounts.hazardous++;
    });

    const distributionData = [
      { name: 'Good', value: pollutantCounts.good },
      { name: 'Moderate', value: pollutantCounts.moderate },
      { name: 'Unhealthy', value: pollutantCounts.unhealthy },
      { name: 'Very Unhealthy', value: pollutantCounts.veryUnhealthy },
      { name: 'Hazardous', value: pollutantCounts.hazardous },
    ].filter(item => item.value > 0);

    // Daily averages (last 7 days)
    const dailyAverages = {};
    readings.forEach(reading => {
      const date = formatChartDate(reading.timestamp);
      const aqiData = getOverallAQI(reading.readings);
      
      if (!dailyAverages[date]) {
        dailyAverages[date] = { total: 0, count: 0 };
      }
      
      dailyAverages[date].total += aqiData?.aqi || 0;
      dailyAverages[date].count += 1;
    });

    const dailyData = Object.entries(dailyAverages)
      .map(([date, data]) => ({
        date,
        aqi: Math.round(data.total / data.count),
      }))
      .slice(-7);

    // Overall stats
    const totalDevices = devices.length;
    const activeDevices = devices.filter(d => d.status === 'active').length;
    const avgAQI = Object.values(latestReadings).reduce((sum, reading) => {
      const aqi = getOverallAQI(reading.readings);
      return sum + (aqi ? aqi.aqi : 0);
    }, 0) / (Object.keys(latestReadings).length || 1);

    const unhealthyCount = Object.values(latestReadings).filter(reading => {
      const aqi = getOverallAQI(reading.readings);
      return aqi && aqi.aqi > 100;
    }).length;

    return {
      areaData,
      topPolluted,
      distributionData,
      dailyData,
      stats: {
        totalDevices,
        activeDevices,
        avgAQI: Math.round(avgAQI),
        unhealthyCount,
      },
    };
  }, [devices, readings, latestReadings]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive air quality insights and trends</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Average AQI"
            value={analytics.stats.avgAQI}
            color="bg-blue-500"
          />
          <StatCard
            icon={<MapPin className="w-6 h-6" />}
            label="Active Sensors"
            value={`${analytics.stats.activeDevices}/${analytics.stats.totalDevices}`}
            color="bg-green-500"
          />
          <StatCard
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Unhealthy Areas"
            value={analytics.stats.unhealthyCount}
            color="bg-red-500"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Total Readings"
            value={readings.length}
            color="bg-purple-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Average AQI by Area */}
          <Card>
            <CardHeader
              title="Average AQI by Area"
              subtitle="Compare air quality across different locations"
            />
            {analytics.areaData.length > 0 ? (
              <BarChart
                data={analytics.areaData}
                dataKey="aqi"
                xKey="name"
                height={300}
                color="#00a087"
              />
            ) : (
              <div className="text-center py-12 text-gray-500">No data available</div>
            )}
          </Card>

          {/* Air Quality Distribution */}
          <Card>
            <CardHeader
              title="Air Quality Distribution"
              subtitle="Current status across all sensors"
            />
            {analytics.distributionData.length > 0 ? (
              <PieChart
                data={analytics.distributionData}
                height={300}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">No data available</div>
            )}
          </Card>
        </div>

        {/* Daily Trend */}
        <Card className="mb-6">
          <CardHeader
            title="7-Day AQI Trend"
            subtitle="Average air quality index over the past week"
          />
          {analytics.dailyData.length > 0 ? (
            <BarChart
              data={analytics.dailyData}
              dataKey="aqi"
              xKey="date"
              height={300}
              color="#3b82f6"
            />
          ) : (
            <div className="text-center py-12 text-gray-500">No data available</div>
          )}
        </Card>

        {/* Top Polluted Locations */}
        <Card>
          <CardHeader
            title="Top Polluted Locations"
            subtitle="Areas with highest air quality index"
          />
          
          {analytics.topPolluted.length > 0 ? (
            <div className="space-y-3">
              {analytics.topPolluted.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full font-bold text-gray-700">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-600">{location.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{location.aqi}</div>
                    <div className="text-xs text-gray-500">AQI</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">No data available</div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <Card hover>
      <div className="flex items-center gap-4">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </Card>
  );
}
