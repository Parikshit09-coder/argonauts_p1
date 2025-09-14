import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [argoId, setArgoId] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    console.log('Starting to fetch data...');
    fetch('/data/floats.json')
      .then(response => {
        console.log('Fetch response status:', response.status);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(jsonData => {
        console.log('Data loaded successfully:', jsonData);
        const arrayData = Array.isArray(jsonData) ? jsonData : [jsonData];
        setData(arrayData);
      })
      .catch(error => {
        console.error('Error loading JSON data:', error);
      });
  }, []);

  const handleSearch = () => {
    console.log('Search triggered');
    const id = argoId.trim().toLowerCase();
    console.log('Searching for Argo ID:', id);
    const result = data.filter(point => point.argo_id.toLowerCase() === id);
    console.log('Search result:', result);
    setFilteredData(result);
    if (result.length > 0) {
      console.log('Match found:', result[0]);
      setSelectedPoint(result[0]);
    } else {
      console.log('No match found');
      setSelectedPoint(null);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem' }}>Argo Data Dashboard</h2>

      {/* Search Area */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Enter Argo ID..."
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

      {filteredData.length === 0 && argoId && (
        <p style={{ textAlign: 'center', color: '#ff4c4c', fontWeight: 'bold' }}>No data found for this Argo ID.</p>
      )}

      {/* Charts Section */}
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ backgroundColor: '#1c1c1c', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', width: '45%', height: '300px', padding: '10px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Temperature (°C)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid stroke="#444" strokeDasharray="5 5" />
              <XAxis dataKey="sample_time" tickFormatter={(time) => new Date(time).toLocaleTimeString()} stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} labelFormatter={(time) => new Date(time).toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="temperature_C" stroke="#FF5733" strokeWidth={3} name="Temperature (°C)" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: '#1c1c1c', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', width: '45%', height: '300px', padding: '10px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Salinity (PSU)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid stroke="#444" strokeDasharray="5 5" />
              <XAxis dataKey="sample_time" tickFormatter={(time) => new Date(time).toLocaleTimeString()} stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} labelFormatter={(time) => new Date(time).toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="salinity_PSU" stroke="#33C1FF" strokeWidth={3} name="Salinity (PSU)" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Map Section */}
      {selectedPoint && (
        <div style={{ marginTop: '40px', width: '100%', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
          <h3 style={{ textAlign: 'center', backgroundColor: '#222', margin: 0, padding: '10px', borderBottom: '1px solid #444' }}>Location Map</h3>
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
                {selectedPoint.argo_id} <br />
                Lat: {selectedPoint.latitude}, Lon: {selectedPoint.longitude}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
