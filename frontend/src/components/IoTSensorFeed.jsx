import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { Wifi, Droplets, ThermometerSun, Leaf, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IoTSensorFeed() {
  const { formData, language } = useStore();
  const t = translations[language];

  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [moisture, setMoisture] = useState(formData.soil_moisture || 45);
  const [temp, setTemp] = useState(formData.temperature || 24);
  const [ph, setPh] = useState(formData.soil_ph || 6.5);
  const [nitrogen, setNitrogen] = useState(formData.soil_n || 40);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString());
      setMoisture(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 2)));
      setTemp(prev => Math.max(0, Math.min(50, prev + (Math.random() - 0.5) * 0.5)));
      setPh(prev => Math.max(0, Math.min(14, prev + (Math.random() - 0.5) * 0.1)));
      setNitrogen(prev => Math.max(0, Math.min(200, prev + (Math.random() - 0.5) * 1.5)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
      {/* Pulse indicator */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute" />
        <div className="w-2 h-2 rounded-full bg-emerald-500 relative z-10" />
        <span className="text-[10px] text-emerald-500 font-bold tracking-wider">LIVE</span>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-2">
        <Wifi size={18} className="text-blue-500" />
        <h3 className="text-lg font-bold text-zinc-100">{t.iot_feed || "IoT Sensor Feed"}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Droplets size={14} className="text-blue-400" />
            <span className="text-xs">{t.iot_moisture || "Moisture"}</span>
          </div>
          <AnimatePresence mode="popLayout">
            <motion.p
              key={moisture.toFixed(1)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-2xl font-bold text-zinc-100"
            >
              {moisture.toFixed(1)}%
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <ThermometerSun size={14} className="text-amber-400" />
            <span className="text-xs">{t.iot_temp || "Soil Temp"}</span>
          </div>
          <AnimatePresence mode="popLayout">
            <motion.p
              key={temp.toFixed(1)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-2xl font-bold text-zinc-100"
            >
              {temp.toFixed(1)}°C
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <FlaskConical size={14} className="text-purple-400" />
            <span className="text-xs">Soil pH</span>
          </div>
          <AnimatePresence mode="popLayout">
            <motion.p
              key={ph.toFixed(2)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-2xl font-bold text-zinc-100"
            >
              {ph.toFixed(2)}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Leaf size={14} className="text-emerald-400" />
            <span className="text-xs">Nitrogen</span>
          </div>
          <AnimatePresence mode="popLayout">
            <motion.p
              key={nitrogen.toFixed(1)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-2xl font-bold text-zinc-100"
            >
              {nitrogen.toFixed(1)} <span className="text-xs font-normal text-zinc-500">ppm</span>
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 text-right">
        <span className="text-[10px] text-zinc-500 font-mono">Last update: {lastUpdate}</span>
      </div>
    </div>
  );
}
