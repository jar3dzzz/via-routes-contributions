"use client";

import { MapContainer, TileLayer, useMapEvents, Polyline, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Waypoint } from "@/app/actions/createRoute";

interface MapProps {
  waypoints: Waypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
}

// Component to handle map clicks
function MapEventHandler({ setWaypoints }: { setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>> }) {
  useMapEvents({
    click(e) {
      setWaypoints((prev) => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }]);
    },
  });
  return null;
}

export default function Map({ waypoints, setWaypoints }: MapProps) {
  // Center roughly on a default location (e.g., somewhere central, maybe user can change this later)
  const defaultCenter = { lat: 17.976116, lng: -92.963802 };
  
  const center = waypoints.length > 0 ? waypoints[waypoints.length - 1] : defaultCenter;

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl shadow-inner border border-gray-200 dark:border-gray-800">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={16} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEventHandler setWaypoints={setWaypoints} />

        {/* Draw lines between waypoints */}
        {waypoints.length > 1 && (
          <Polyline 
            positions={waypoints.map(wp => [wp.lat, wp.lng])} 
            color="#3b82f6" 
            weight={4}
            opacity={0.8}
          />
        )}

        {/* Draw the waypoints as circles */}
        {waypoints.map((wp, i) => (
          <CircleMarker
            key={i}
            center={[wp.lat, wp.lng]}
            pathOptions={{
              color: i === 0 ? "#10b981" : i === waypoints.length - 1 ? "#ef4444" : "#3b82f6",
              fillColor: i === 0 ? "#10b981" : i === waypoints.length - 1 ? "#ef4444" : "#white",
              fillOpacity: 1,
              weight: 2
            }}
            radius={6}
          />
        ))}
      </MapContainer>
      
      {/* Overlay to show instructions */}
      {waypoints.length === 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md z-10 text-sm font-medium animate-pulse">
          Haz clic en el mapa para añadir el primer punto de ruta
        </div>
      )}
    </div>
  );
}
