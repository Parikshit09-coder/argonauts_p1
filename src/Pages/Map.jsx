import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet - using imports instead of require
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

const FitBounds = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (data.length > 0) {
      const bounds = data.map(item => [item.latitude, item.longitude]);
      map.fitBounds(bounds);
    }
  }, [data, map]);

  return null;
};

const HighlightMarker = ({ item, map }) => {
  const markerRef = useRef();

  useEffect(() => {
    if (item && markerRef.current) {
      markerRef.current.openPopup();
      map.setView([item.latitude, item.longitude], 8); // Zoom to the found marker
    }
  }, [item, map]);

  if (!item) return null;

  return (
    <CircleMarker
      ref={markerRef}
      center={[item.latitude, item.longitude]}
      radius={8}  // Larger radius for highlighted marker
      color="blue"
      fillColor="blue"
      fillOpacity={0.9}
      weight={3}
    >
      <Popup>
        <div>
          <strong>Argo ID:</strong> {item.argo_id}<br />
          <strong>Temperature (°C):</strong> {item.temperature_C}<br />
          <strong>Salinity (PSU):</strong> {item.salinity_PSU}<br />
          <strong>Lat:</strong> {item.latitude}<br />
          <strong>Lng:</strong> {item.longitude}
        </div>
      </Popup>
    </CircleMarker>
  );
};

const Map = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [foundItem, setFoundItem] = useState(null);
  const [searchError, setSearchError] = useState('');
  const mapRef = useRef();

  useEffect(() => {
    fetch('/data/floats.json') 
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error('Error loading data:', err));
  }, []);

  const handleSearch = () => {
    setSearchError('');
    setFoundItem(null);
    
    if (!searchTerm.trim()) {
      setSearchError('Please enter an Argo ID');
      return;
    }

    const found = data.find(item => 
      item.argo_id.toLowerCase() === searchTerm.toLowerCase().trim()
    );

    if (found) {
      setFoundItem(found);
    } else {
      setSearchError(`Argo ID "${searchTerm}" not found`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFoundItem(null);
    setSearchError('');
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative'}}>
      {/* Search Box */}
      <div style={{
        marginLeft: '75%',
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        minWidth: '300px'
      }}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
          <input
            type="text"
            placeholder="Enter Argo ID (e.g., ARGO00001)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '3px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Search
          </button>
          <button
            onClick={clearSearch}
            style={{
              padding: '8px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Clear
          </button>
        </div>
        {searchError && (
          <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
            {searchError}
          </div>
        )}
        {foundItem && (
          <div style={{ color: 'green', fontSize: '12px', marginTop: '5px' }}>
            Found: {foundItem.argo_id}
          </div>
        )}
      </div>

      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <FitBounds data={data} />
        
        {/* Regular markers */}
        {data.map((item, idx) => (
          <CircleMarker
            key={idx}
            center={[item.latitude, item.longitude]}
            radius={3}
            color="red"
            fillColor="red"
            fillOpacity={0.75}
          >
            <Popup>
              <div>
                <strong>Argo ID:</strong> {item.argo_id}<br />
                <strong>Temperature (°C):</strong> {item.temperature_C}<br />
                <strong>Salinity (PSU):</strong> {item.salinity_PSU}<br />
                <strong>Lat:</strong> {item.latitude}<br />
                <strong>Lng:</strong> {item.longitude}
              </div>
            </Popup>
          </CircleMarker>
        ))}
        
        {/* Highlighted marker for search result */}
        {foundItem && (
          <HighlightMarker 
            item={foundItem} 
            map={mapRef.current} 
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;