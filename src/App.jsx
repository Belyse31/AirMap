import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LiveMap } from './pages/LiveMap';
import { DeviceHub } from './pages/DeviceHub';
import { DeviceDetails } from './pages/DeviceDetails';
import { DeviceForm } from './pages/DeviceForm';
import { Analytics } from './pages/Analytics';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="map" element={<LiveMap />} />
          <Route path="devices" element={<DeviceHub />} />
          <Route path="devices/new" element={<DeviceForm />} />
          <Route path="devices/:id" element={<DeviceDetails />} />
          <Route path="devices/:id/edit" element={<DeviceForm />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
