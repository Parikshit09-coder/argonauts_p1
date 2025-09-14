import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Dashboard = () => {
  const [data, setData] = useState({});
  const [argoId, setArgoId] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Load JSON
  useEffect(() => {
    fetch('/data/argo_profiles.json')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('Error loading JSON:', err));
  }, []);

  // Search handler
  const handleSearch = () => {
    const id = argoId.trim();
    if (!id || !data[id]) {
      setSelectedProfiles([]);
      setSelectedPoint(null);
      return;
    }
    setSelectedProfiles(data[id]);
    setSelectedPoint({
      argoId: id,
      latitude: data[id][0].latitude_degN,
      longitude: data[id][0].longitude_degE
    });
  };

  // Convert one profile → chart-friendly array
  const profileToChartData = (profile) => {
    return Object.values(profile.measurements)
      .map(vals => ({
        depth: vals.pressure_dbar, // use actual pressure as depth
        temperature: vals.temperature_degC,
        salinity: vals.salinity_psu
      }))
      .sort((a, b) => a.depth - b.depth);
  };

  return (
    <div style={{
      background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      minHeight: '100vh',
      color: '#fff',
      padding: '20px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem' }}>
        Argo Data Dashboard
      </h2>

      {/* Search */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input className='text-black bg-white hover:bg-gray-200'
          type="text"
          placeholder="Enter Argo ID (e.g., 1902294)"
          value={argoId}
          onChange={e => setArgoId(e.target.value)}
          style={{
            padding: '10px',
            width: '250px',
            borderRadius: '8px',
            border: 'none',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>

      {/* Charts */}
      {selectedProfiles.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {/* Temperature vs Depth */}
          <div style={{
            backgroundColor: '#1c1c1c',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            width: '45%',
            height: '400px',
            padding: '10px'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Temperature vs Depth</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={profileToChartData(selectedProfiles[0])}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid stroke="#444" strokeDasharray="5 5" />
                <XAxis 
                  dataKey="temperature" 
                  type="number" 
                  stroke="#ccc"
                  label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  dataKey="depth" 
                  type="number" 
                  stroke="#ccc" 
                  reversed
                  domain={['dataMax + 100', 'dataMin - 100']}
                  label={{ value: 'Depth (dbar)', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="depth" 
                  stroke="#FF5733" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Salinity vs Depth */}
          <div style={{
            backgroundColor: '#1c1c1c',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            width: '45%',
            height: '400px',
            padding: '10px'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Salinity vs Depth</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={profileToChartData(selectedProfiles[0])}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid stroke="#444" strokeDasharray="5 5" />
                <XAxis 
                  dataKey="salinity" 
                  type="number" 
                  stroke="#ccc"
                  label={{ value: 'Salinity (PSU)', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  dataKey="depth" 
                  type="number" 
                  stroke="#ccc" 
                  reversed
                  domain={['dataMax + 100', 'dataMin - 100']}
                  label={{ value: 'Depth (dbar)', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="depth" 
                  stroke="#33C1FF" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Map */}
      {selectedPoint && (
        <div style={{
          marginTop: '40px',
          width: '100%',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{
            textAlign: 'center',
            backgroundColor: '#222',
            margin: 0,
            padding: '10px',
            borderBottom: '1px solid #444'
          }}>
            Location Map
          </h3>
          <MapContainer
            center={[selectedPoint.latitude, selectedPoint.longitude]}
            zoom={5}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[selectedPoint.latitude, selectedPoint.longitude]}>
              <Popup>
                <strong>{selectedPoint.argoId}</strong><br />
                Lat: {selectedPoint.latitude.toFixed(3)}, Lon: {selectedPoint.longitude.toFixed(3)}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;