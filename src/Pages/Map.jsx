import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const FitBounds = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = markers.map(m => [m.latitude, m.longitude]);
      map.fitBounds(bounds);
    }
  }, [markers, map]);
  return null;
};

const Map = () => {
  const [data, setData] = useState({});
  const mapRef = useRef();

  useEffect(() => {
    fetch('/data/argo_profiles.json')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('Error loading data:', err));
  }, []);

  // Convert nested JSON into markers list (but keep nested structure)
  const markers = [];
  Object.entries(data).forEach(([argoId, profiles]) => {
    profiles.forEach(profile => {
      markers.push({
        argoId,
        latitude: profile.latitude_degN,
        longitude: profile.longitude_degE,
        measurements: profile.measurements
      });
    });
  });

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <FitBounds markers={markers} />

        {markers.map((item, idx) => (
          <CircleMarker
            key={idx}
            center={[item.latitude, item.longitude]}
            radius={5}
            color="red"
            fillColor="red"
            fillOpacity={0.8}
          >
            <Popup maxWidth={400}>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <strong>Argo ID:</strong> {item.argoId}<br />
                <strong>Lat:</strong> {item.latitude.toFixed(3)}<br />
                <strong>Lng:</strong> {item.longitude.toFixed(3)}<br />
                <hr />
                <strong>Depth-wise measurements:</strong>
                <table style={{ fontSize: '12px', borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '1px solid #ccc' }}>Depth (m)</th>
                      <th style={{ borderBottom: '1px solid #ccc' }}>Pressure (dbar)</th>
                      <th style={{ borderBottom: '1px solid #ccc' }}>Temp (°C)</th>
                      <th style={{ borderBottom: '1px solid #ccc' }}>Salinity (PSU)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(item.measurements).map(([depth, vals]) => (
                      <tr key={depth}>
                        <td>{depth}</td>
                        <td>{vals.pressure_dbar.toFixed(1)}</td>
                        <td>{vals.temperature_degC.toFixed(2)}</td>
                        <td>{vals.salinity_psu.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
