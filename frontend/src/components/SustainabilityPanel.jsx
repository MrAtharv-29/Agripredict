import { useStore } from '../store';
import { Leaf, Droplets, Wind, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SustainabilityPanel() {
  const { predictionResult } = useStore();
  const score = predictionResult?.sustainability_score;

  if (!score) return null;

  const getScoreColor = (rating) => {
    switch (rating) {
      case 'A': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
      case 'B': return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
      case 'C': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      default: return 'text-red-400 border-red-500/20 bg-red-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Leaf className="text-emerald-400" size={20} />
          Sustainability Score
        </h3>
        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-xl ${getScoreColor(score.rating)}`}>
          {score.rating}
        </div>
      </div>

      <div className="space-y-6">
        {/* Score Bar */}
        <div>
          <div className="flex justify-between text-xs text-zinc-500 mb-2">
            <span>Environmental Impact</span>
            <span>{score.overall_score}/100</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.overall_score}%` }}
              className={`h-full ${score.overall_score > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Droplets size={18} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Water Efficiency</p>
              <p className="text-sm font-semibold text-zinc-200">{score.water_efficiency}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-500/10 text-zinc-400">
              <Wind size={18} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Carbon Footprint</p>
              <p className="text-sm font-semibold text-zinc-200">{score.carbon_footprint_kg_co2_eq} kg CO2</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs font-bold text-zinc-400 flex items-center gap-1 mb-2">
            <Info size={12} /> Compliance Recommendations
          </p>
          <ul className="space-y-2">
            {score.recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-zinc-400 flex gap-2">
                <span className="text-emerald-500">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
