import { useStore } from '../store';
import { translations } from '../translations';
import { Sliders, ArrowRight, FlaskConical } from 'lucide-react';
import { useState } from 'react';

export default function ScenarioPlanner() {
  const { predictionResult, language } = useStore();
  const t = translations[language];

  // Local state for what-if changes
  const [simRainfall, setSimRainfall] = useState(0); // Difference in %
  const [simNitrogen, setSimNitrogen] = useState(0); // Difference in %
  const [simTemp, setSimTemp] = useState(0); // Difference in degrees C

  if (!predictionResult) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm h-full flex flex-col justify-center items-center text-center">
        <FlaskConical size={32} className="text-purple-500/50 mb-3" />
        <h3 className="text-lg font-bold text-zinc-100 mb-2">Decision Lab</h3>
        <p className="text-sm text-zinc-500 max-w-xs">{t.scenario_waiting || "Run a forecast first to enable the decision lab."}</p>
      </div>
    );
  }

  const baseYield = predictionResult.yield_prediction;
  
  // Real-time recalculation math mock
  // Rainfall has positive impact if < 20%, negative if > 20%
  // Nitrogen generally positive up to a point
  // Temp generally negative if increased
  const rainDelta = (simRainfall * 0.005);
  const nitrogenDelta = (simNitrogen * 0.003);
  const tempDelta = (simTemp * -0.05);
  
  let simulatedYield = baseYield * (1 + rainDelta + nitrogenDelta + tempDelta);
  simulatedYield = Math.max(0, simulatedYield); // Prevent negative yield

  const diffAbsolute = simulatedYield - baseYield;
  const diffPercent = (diffAbsolute / baseYield) * 100;
  
  const isPositive = diffAbsolute >= 0;
  const directionText = isPositive ? "increase" : "decrease";
  const diffColor = isPositive ? "text-emerald-400" : "text-red-400";
  const sign = isPositive ? "+" : "";

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <FlaskConical size={64} className="text-purple-500" />
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-2 relative z-10">
        <Sliders size={18} className="text-purple-500" />
        <h3 className="text-lg font-bold text-zinc-100">Decision Lab</h3>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Dynamic Text Output */}
        <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 text-center">
          <p className="text-lg font-medium text-zinc-300">
            Yield will <span className={diffColor}>{directionText}</span> from{' '}
            <span className="font-bold text-zinc-100">{baseYield.toFixed(2)}</span> →{' '}
            <span className="font-bold text-zinc-100">{simulatedYield.toFixed(2)}</span> t/ha{' '}
            <span className={`font-bold ${diffColor}`}>({sign}{diffPercent.toFixed(1)}%)</span>
          </p>
        </div>

        {/* Sliders */}
        <div className="space-y-5">
          {/* Rainfall */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="text-zinc-400 font-medium">Rainfall / Irrigation</label>
              <span className={`font-bold ${simRainfall > 0 ? 'text-cyan-400' : simRainfall < 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
                {simRainfall > 0 ? '+' : ''}{simRainfall}%
              </span>
            </div>
            <input 
              type="range" min="-50" max="50" step="5" value={simRainfall} 
              onChange={(e) => setSimRainfall(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Nitrogen */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="text-zinc-400 font-medium">Nitrogen Fertilizer</label>
              <span className={`font-bold ${simNitrogen > 0 ? 'text-emerald-400' : simNitrogen < 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
                {simNitrogen > 0 ? '+' : ''}{simNitrogen}%
              </span>
            </div>
            <input 
              type="range" min="-50" max="50" step="5" value={simNitrogen} 
              onChange={(e) => setSimNitrogen(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Temperature */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="text-zinc-400 font-medium">Average Temperature</label>
              <span className={`font-bold ${simTemp > 0 ? 'text-red-400' : simTemp < 0 ? 'text-blue-400' : 'text-zinc-400'}`}>
                {simTemp > 0 ? '+' : ''}{simTemp}°C
              </span>
            </div>
            <input 
              type="range" min="-5" max="5" step="0.5" value={simTemp} 
              onChange={(e) => setSimTemp(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
