import { useStore } from '../store';
import { LayoutGrid, Trophy, ArrowUpRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MultiFarmComparison() {
  const farms = [
    { name: 'North Field A', crop: 'Rice', yield: 7.2, health: '92%', status: 'Excellent' },
    { name: 'South Field B', crop: 'Wheat', yield: 5.4, health: '85%', status: 'Good' },
    { name: 'East Sector 4', crop: 'Maize', yield: 8.1, health: '95%', status: 'Optimal' },
    { name: 'West Plot 2', crop: 'Cotton', yield: 4.2, health: '72%', status: 'Stress Detected' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <LayoutGrid className="text-emerald-400" size={20} />
          Multi-Farm Comparison
        </h3>
        <button className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
          <Search size={12} /> View All
        </button>
      </div>

      <div className="space-y-4">
        {farms.sort((a, b) => b.yield - a.yield).map((farm, i) => (
          <div key={i} className="group relative p-4 rounded-xl bg-zinc-800/30 border border-zinc-800 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">{farm.name}</p>
                <p className="text-xs text-zinc-500">{farm.crop} • {farm.status}</p>
              </div>
              {i === 0 && (
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <Trophy size={14} />
                </div>
              )}
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-zinc-600 uppercase font-black">Predicted Yield</p>
                <p className="text-lg font-black text-zinc-200">{farm.yield} <span className="text-xs font-normal text-zinc-500">t/ha</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-600 uppercase font-black">Crop Health</p>
                <p className={`text-sm font-bold ${farm.yield > 6 ? 'text-emerald-400' : 'text-amber-400'}`}>{farm.health}</p>
              </div>
            </div>

            {/* Micro-sparkline mock */}
            <div className="mt-3 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: farm.health }}
                className={`h-full ${farm.yield > 6 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 rounded-lg border border-dashed border-zinc-700 text-zinc-500 text-sm hover:border-emerald-500/50 hover:text-emerald-400 transition-all flex items-center justify-center gap-2">
        <ArrowUpRight size={14} /> Compare Global Benchmarks
      </button>
    </motion.div>
  );
}
