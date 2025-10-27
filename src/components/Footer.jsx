import { Link } from 'react-router-dom';
import { Wind, Github, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AirMap</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Real-time IoT air quality monitoring and mapping platform. 
              Empowering communities with actionable environmental data.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@airmap.io"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">
                  Live Map
                </Link>
              </li>
              <li>
                <Link to="/devices" className="hover:text-white transition-colors">
                  Device Hub
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for cleaner air
          </p>
          <p className="mt-2 text-gray-500">
            © {currentYear} AirMap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
