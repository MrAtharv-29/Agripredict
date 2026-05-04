import { useStore } from '../store';
import { translations } from '../translations';
import { BellRing, AlertTriangle, CloudRain, Bug, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartAlerts() {
  const { formData, language } = useStore();
  const t = translations[language];

  // Dynamic alert generation logic based on form inputs and time
  const generateAlerts = () => {
    const alerts = [];
    
    // Disease & Pest Prediction (High Humidity/Moisture)
    if (formData.soil_moisture > 75) {
      alerts.push({
        id: 'fungal',
        type: 'critical',
        icon: Bug,
        title: 'High Fungal Infection Risk',
        message: 'Current soil moisture exceeds 75%. High risk of root rot and fungal disease.',
        time: 'Just now'
      });
    }

    // Weather Prediction (Simulated based on region)
    if (formData.location === 'West' || formData.location === 'Central') {
      alerts.push({
        id: 'drought',
        type: 'warning',
        icon: CloudRain,
        title: 'Low Rainfall Expected',
        message: 'Weather models predict a 40% drop in rainfall over the next 5 days.',
        time: '2 hours ago'
      });
    } else {
      alerts.push({
        id: 'storm',
        type: 'warning',
        icon: AlertTriangle,
        title: 'Heavy Rains Expected',
        message: 'Incoming weather front. Prepare for heavy downpours in 48 hours.',
        time: '4 hours ago'
      });
    }
    
    // Nutrient Alert
    if (formData.soil_n < 20) {
      alerts.push({
        id: 'nitrogen',
        type: 'info',
        icon: ShieldAlert,
        title: 'Nitrogen Depletion',
        message: 'Soil N levels are critically low for optimal yield.',
        time: '1 day ago'
      });
    }

    return alerts;
  };

  const activeAlerts = generateAlerts();

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm h-full">
      <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <BellRing size={18} className="text-amber-500" />
          <h3 className="text-lg font-bold text-zinc-100">Smart Alerts</h3>
        </div>
        <span className="bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded-full">
          {activeAlerts.length} Active
        </span>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {activeAlerts.map((alert) => {
            const Icon = alert.icon;
            const isCritical = alert.type === 'critical';
            const isWarning = alert.type === 'warning';
            
            let bgStyle = 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400';
            let iconStyle = 'text-blue-400 bg-blue-500/10';
            
            if (isCritical) {
              bgStyle = 'bg-red-500/10 border-red-500/20 text-red-200';
              iconStyle = 'text-red-500 bg-red-500/20';
            } else if (isWarning) {
              bgStyle = 'bg-amber-500/10 border-amber-500/20 text-amber-200';
              iconStyle = 'text-amber-500 bg-amber-500/20';
            }

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border flex gap-3 ${bgStyle}`}
              >
                <div className={`p-2 rounded-lg h-fit ${iconStyle}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-zinc-100">{alert.title}</h4>
                    <span className="text-[10px] opacity-70">{alert.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{alert.message}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
