import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Wifi, WifiOff, Wind } from 'lucide-react';
import { useState } from 'react';
import { useReadings } from '../hooks/useReadings';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useReadings();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/map', label: 'Live Map' },
    { to: '/devices', label: 'Device Hub' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                AirMap
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Connection Status & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Connection Indicator */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                isConnected
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
              title={isConnected ? 'Real-time updates active' : 'Using polling mode'}
            >
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span>Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span>Offline</span>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            
            {/* Mobile connection status */}
            <div className="pt-2 px-4">
              <div
                className={`flex items-center gap-2 text-xs font-medium ${
                  isConnected ? 'text-green-700' : 'text-gray-600'
                }`}
              >
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span>{isConnected ? 'Real-time updates active' : 'Using polling mode'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
