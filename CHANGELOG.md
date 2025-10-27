# Changelog

All notable changes to AirMap will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release of AirMap
- Interactive live map with Leaflet
- Real-time WebSocket updates for sensor data
- Device management hub with CRUD operations
- Analytics dashboard with charts and statistics
- Responsive design with Tailwind CSS
- Mock Node.js server with Express and WebSocket
- CSV import/export for devices
- Heatmap overlay for pollutant visualization
- Time slider for historical data playback
- AQI calculation based on EPA standards
- Toast notifications for user feedback
- Loading states and skeleton screens
- Docker support with docker-compose
- Comprehensive documentation
- Unit tests for critical functions
- Deployment guides for multiple platforms

### Features

#### Frontend
- **Home Page** - Project overview and statistics
- **Live Map** - Interactive map with real-time sensor markers
- **Device Hub** - Manage devices with search, filter, and pagination
- **Device Details** - Detailed view with charts and location
- **Device Form** - Add/edit devices with map-based location picker
- **Analytics** - Comprehensive dashboard with multiple chart types
- **About** - Project information and technology stack
- **Contact** - Contact form with validation

#### Backend
- RESTful API for devices and readings
- WebSocket server for real-time updates
- Automatic sensor data simulation
- JSON file-based storage for demo
- CORS enabled for cross-origin requests

#### Components
- Reusable UI components (Button, Card, Badge, etc.)
- Map components (DeviceMarker, HeatmapLayer, MapControls)
- Chart components (TimeSeriesChart, BarChart, PieChart)
- Custom hooks (useWebSocket, useDevices, useReadings, useToast)
- Toast notification system
- Loading spinners and skeletons
- Search and pagination components

#### Developer Experience
- Vite for fast development
- Hot module replacement
- ESLint configuration
- Vitest for testing
- Docker containerization
- Environment variable support

### Documentation
- Comprehensive README with quick start guide
- API documentation
- Deployment guide for multiple platforms
- Contributing guidelines
- Demo recording plan
- Quick start guide
- Mock server documentation

### Technical Details
- React 18 with functional components and hooks
- React Router for navigation
- Tailwind CSS for styling
- Leaflet for maps
- Recharts for data visualization
- Node.js + Express backend
- WebSocket (ws library)
- date-fns for date formatting
- PapaParse for CSV parsing
- Lucide React for icons

---

## [Unreleased]

### Planned Features
- User authentication and authorization
- Database integration (PostgreSQL/MongoDB)
- Real MQTT broker integration
- Mobile app (React Native)
- Email notifications for alerts
- Advanced analytics with ML predictions
- Multi-language support (i18n)
- Dark mode theme
- Export reports as PDF
- Historical data comparison
- Device grouping and tagging
- Custom alert thresholds
- API rate limiting
- Webhook support
- GraphQL API option

### Improvements
- Performance optimization for large datasets
- Better error handling and logging
- Accessibility improvements
- SEO optimization
- Progressive Web App (PWA) support
- Offline mode with service workers
- Advanced filtering and sorting
- Bulk device operations
- Data export in multiple formats
- Customizable dashboard widgets

---

## Version History

### [1.0.0] - 2024-01-15
- Initial public release

---

## Migration Guides

### From Mock to Production

When migrating from the mock server to production:

1. **Database Setup**
   - Replace JSON files with PostgreSQL or MongoDB
   - Create database schema
   - Migrate existing data

2. **Authentication**
   - Implement JWT or OAuth2
   - Add user registration and login
   - Protect API endpoints

3. **WebSocket**
   - Use production WebSocket server (Socket.io recommended)
   - Implement authentication for WebSocket connections
   - Add reconnection logic

4. **Deployment**
   - Set up CI/CD pipeline
   - Configure environment variables
   - Enable HTTPS/WSS
   - Set up monitoring and logging

---

## Support

For questions or issues:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Email: info@airmap.io
- Documentation: [README.md](./README.md)

---

**Note:** This is version 1.0.0 - the initial release. Future versions will include additional features and improvements based on community feedback.
