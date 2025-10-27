import { Link } from 'react-router-dom';
import { MapPin, Activity, BarChart3, Shield, ArrowRight, Wind } from 'lucide-react';
import { Button } from '../components/Button';
import { useDevices } from '../hooks/useDevices';
import { useReadings } from '../hooks/useReadings';
import { getOverallAQI } from '../utils/airQuality';

export function Home() {
  const { devices } = useDevices();
  const { latestReadings } = useReadings();

  // Calculate stats
  const activeDevices = devices.filter(d => d.status === 'active').length;
  const totalReadings = Object.keys(latestReadings).length;
  
  const avgAQI = Object.values(latestReadings).reduce((sum, reading) => {
    const aqi = getOverallAQI(reading.readings);
    return sum + (aqi ? aqi.aqi : 0);
  }, 0) / (totalReadings || 1);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Breathe Better with{' '}
                <span className="text-primary-200">Real-Time</span> Air Quality Data
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                Monitor, analyze, and visualize air quality across your city with our 
                IoT-powered mapping platform. Make informed decisions for a healthier tomorrow.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/map">
                  <Button size="lg" variant="secondary" icon={MapPin}>
                    View Live Map
                  </Button>
                </Link>
                <Link to="/devices">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    Explore Devices
                  </Button>
                </Link>
              </div>
            </div>

            {/* Animated Illustration */}
            <div className="relative hidden md:block">
              <div className="relative w-full h-96">
                {/* Glowing circles animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-primary-400/20 rounded-full animate-pulse-slow" />
                  <div className="absolute w-48 h-48 bg-primary-300/30 rounded-full animate-pulse" />
                  <div className="absolute w-32 h-32 bg-primary-200/40 rounded-full flex items-center justify-center">
                    <Wind className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Activity className="w-8 h-8 text-primary-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">{activeDevices}</div>
              <div className="text-gray-600 mt-2">Active Sensors</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">{totalReadings}</div>
              <div className="text-gray-600 mt-2">Real-Time Readings</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">{Math.round(avgAQI)}</div>
              <div className="text-gray-600 mt-2">Average AQI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How AirMap Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines IoT sensors, real-time data processing, and 
              interactive visualization to give you complete air quality insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Activity className="w-8 h-8" />}
              title="Real-Time Monitoring"
              description="IoT sensors continuously measure PM2.5, PM10, CO, and NO₂ levels across multiple locations with WebSocket updates."
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8" />}
              title="Interactive Maps"
              description="Visualize air quality with color-coded markers, heatmap overlays, and historical data playback."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Advanced Analytics"
              description="Track trends, identify pollution hotspots, and generate insights with comprehensive charts and reports."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Monitoring?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join the movement for cleaner air. Add your first sensor or explore existing data.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/map">
              <Button size="lg" variant="secondary" icon={ArrowRight}>
                Explore Live Map
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
