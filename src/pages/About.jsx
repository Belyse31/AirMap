import { Wind, Target, Users, Zap, Shield, Globe } from 'lucide-react';
import { Card } from '../components/Card';

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Wind className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About AirMap</h1>
          <p className="text-xl text-primary-100">
            Empowering communities with real-time air quality data through innovative IoT technology
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  AirMap was created to address the growing concern of air pollution in urban areas. 
                  Our mission is to provide accessible, real-time air quality data to help communities 
                  make informed decisions about their health and environment. By leveraging IoT sensors 
                  and modern web technologies, we're making environmental monitoring more transparent 
                  and actionable.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Deploy Sensors"
              description="IoT air quality sensors are strategically placed across the city to monitor PM2.5, PM10, CO, and NO₂ levels continuously."
              icon={<Zap className="w-6 h-6" />}
            />
            <StepCard
              number="2"
              title="Real-Time Data"
              description="Sensors transmit readings via WebSocket or MQTT to our platform, providing live updates every few seconds."
              icon={<Globe className="w-6 h-6" />}
            />
            <StepCard
              number="3"
              title="Visualize & Act"
              description="Data is visualized on interactive maps and charts, helping you understand air quality patterns and take action."
              icon={<Shield className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              title="Real-Time Monitoring"
              description="Get instant updates on air quality with WebSocket-powered live data streaming from all connected sensors."
            />
            <FeatureCard
              title="Interactive Maps"
              description="Explore air quality across your city with color-coded markers, heatmap overlays, and historical playback."
            />
            <FeatureCard
              title="Comprehensive Analytics"
              description="Analyze trends, compare areas, and identify pollution hotspots with detailed charts and statistics."
            />
            <FeatureCard
              title="Device Management"
              description="Easily add, configure, and monitor IoT sensors through an intuitive admin interface."
            />
            <FeatureCard
              title="Health Recommendations"
              description="Receive personalized health advice based on current air quality index (AQI) levels."
            />
            <FeatureCard
              title="Data Export"
              description="Export device data and readings in CSV format for further analysis or reporting."
            />
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Technology Stack</h2>
          
          <Card>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Frontend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• React 18 with Hooks</li>
                  <li>• Vite for fast development</li>
                  <li>• React Router for navigation</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Leaflet for interactive maps</li>
                  <li>• Recharts for data visualization</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Backend & IoT</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Node.js + Express API</li>
                  <li>• WebSocket for real-time updates</li>
                  <li>• MQTT protocol support</li>
                  <li>• LocalStorage for demo persistence</li>
                  <li>• RESTful API architecture</li>
                  <li>• JSON data format</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Communities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AirMap is an open-source project designed to be accessible to cities, 
              research institutions, and environmental organizations worldwide. We believe 
              clean air is a fundamental right, and data transparency is the first step 
              toward meaningful change.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepCard({ number, title, description, icon }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-4">
        {number}
      </div>
      <div className="flex justify-center mb-3">
        <div className="bg-primary-100 text-primary-600 p-3 rounded-lg">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <Card hover>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
}
