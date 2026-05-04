import { MapContainer, TileLayer, Rectangle, Popup, useMap, Marker } from 'react-leaflet';
import { useStore } from '../store';
import { useEffect, useState } from 'react';
import { translations } from '../translations';
import { Globe2, Crosshair, TrendingUp, TrendingDown } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const regionCoords = {
  'North': [28.7041, 77.1025],
  'South': [13.0827, 80.2707],
  'East': [22.5726, 88.3639],
  'West': [19.0760, 72.8777],
  'Central': [21.1458, 79.0882]
};

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function SatelliteMap() {
  const { formData, predictionResult, language } = useStore();
  const t = translations[language];
  
  const [userLoc, setUserLoc] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const center = userLoc || regionCoords[formData.location] || regionCoords['Central'];
  
  const bounds = [
    [center[0] - 0.05, center[1] - 0.05],
    [center[0] + 0.05, center[1] + 0.05]
  ];

  let polyColor = '#facc15'; // Yellow
  if (formData.ndvi > 0.6) polyColor = '#22c55e'; // Green
  if (formData.ndvi > 0.8) polyColor = '#15803d'; // Dark Green
  if (formData.ndvi < 0.4) polyColor = '#ef4444'; // Red

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLoc([position.coords.latitude, position.coords.longitude]);
          setIsDetecting(false);
        },
        (error) => {
          console.error("Error getting location", error);
          setIsDetecting(false);
        }
      );
    } else {
      setIsDetecting(false);
    }
  };

  // Mock regional comparison
  const regionalAvg = 5.2; // t/ha mocked average
  const currentYield = predictionResult ? predictionResult.yield_prediction : null;
  const isAboveAvg = currentYield && currentYield > regionalAvg;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm relative">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <Globe2 size={18} className="text-cyan-500" />
          <h3 className="text-lg font-bold text-zinc-100">{t.geospatial || "Geo-Intelligence Map"}</h3>
        </div>
        
        <button 
          onClick={handleDetectLocation}
          disabled={isDetecting}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700 disabled:opacity-50"
        >
          <Crosshair size={14} className={isDetecting ? "animate-spin" : "text-cyan-400"} />
          {isDetecting ? "Detecting..." : "My Farm"}
        </button>
      </div>
      
      <div className="h-72 w-full rounded-lg overflow-hidden border border-zinc-700 relative">
        {/* Geo-Intelligence Overlay */}
        {currentYield && (
          <div className="absolute top-4 left-4 z-[400] bg-zinc-900/90 backdrop-blur border border-zinc-700 p-3 rounded-lg shadow-xl min-w-[150px]">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Farm vs Region Avg</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-zinc-100">{currentYield.toFixed(1)}</span>
              <span className="text-sm text-zinc-500">v {regionalAvg}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${isAboveAvg ? 'text-emerald-400' : 'text-red-400'}`}>
              {isAboveAvg ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
              {Math.abs(currentYield - regionalAvg).toFixed(1)} t/ha {isAboveAvg ? 'above' : 'below'} avg
            </div>
          </div>
        )}

        <MapContainer center={center} zoom={userLoc ? 12 : 5} style={{ height: '100%', width: '100%', zIndex: 1 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={center} />
          
          {userLoc && (
            <Marker position={userLoc}>
              <Popup>Your Detected Location</Popup>
            </Marker>
          )}

          {predictionResult && !userLoc && (
            <Rectangle bounds={bounds} pathOptions={{ color: polyColor, weight: 2, fillOpacity: 0.5 }}>
              <Popup>
                <div className="text-zinc-900">
                  <b>{formData.location} Farm</b><br/>
                  NDVI Scan: {formData.ndvi}<br/>
                  Predicted Yield: {predictionResult.yield_prediction} t/ha
                </div>
              </Popup>
            </Rectangle>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
