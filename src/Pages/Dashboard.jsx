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
  const [availableIds, setAvailableIds] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Load JSON data
  useEffect(() => {
    fetch('/data/argo_profiles.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setAvailableIds(Object.keys(json)); // Extract all IDs
      })
      .catch(err => console.error('Error loading JSON:', err));
  }, []);

  // Update selected profiles when argoId changes
  useEffect(() => {
    if (!argoId || !data[argoId]) {
      setSelectedProfiles([]);
      setSelectedPoint(null);
      return;
    }
    setSelectedProfiles(data[argoId]);
    setSelectedPoint({
      argoId: argoId,
      latitude: data[argoId][0].latitude_degN,
      longitude: data[argoId][0].longitude_degE
    });
  }, [argoId, data]);

  // Convert profile data for charts
  const profileToChartData = (profile) => {
    return Object.values(profile.measurements)
      .map(vals => ({
        depth: vals.pressure_dbar,
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

      {/* Dropdown for selecting Argo ID */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <select
          value={argoId}
          onChange={e => setArgoId(e.target.value)}
          style={{
            padding: '10px',
            width: '250px',
            borderRadius: '8px',
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            color: '#000',
            backgroundColor: '#fff'
          }}
        >
          <option value="">Select Argo ID</option>
          {availableIds.map(id => (
            <option key={id} value={id} style={{ color: '#000', backgroundColor: '#fff' }}>
              {id}
            </option>
          ))}
        </select>
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
