import { motion } from 'framer-motion';
import { Share2, Zap, Cloud, Droplets, Sun, Database } from 'lucide-react';

export default function InsightGraph() {
  const nodes = [
    { id: 'soil', label: 'Soil Health', icon: <Database size={16} />, x: 50, y: 50, color: 'text-amber-400' },
    { id: 'weather', label: 'Microclimate', icon: <Cloud size={16} />, x: 250, y: 50, color: 'text-blue-400' },
    { id: 'water', label: 'Hydration', icon: <Droplets size={16} />, x: 150, y: 150, color: 'text-cyan-400' },
    { id: 'yield', label: 'Yield Output', icon: <Zap size={16} />, x: 150, y: 250, color: 'text-emerald-400' },
    { id: 'sun', label: 'Solar Index', icon: <Sun size={16} />, x: 300, y: 150, color: 'text-yellow-400' },
  ];

  const connections = [
    { from: 'soil', to: 'water' },
    { from: 'weather', to: 'water' },
    { from: 'weather', to: 'sun' },
    { from: 'water', to: 'yield' },
    { from: 'soil', to: 'yield' },
    { from: 'sun', to: 'yield' },
  ];

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
        <Share2 className="text-emerald-400" size={20} />
        AI Knowledge Graph
      </h3>

      <div className="relative h-[320px] w-full border border-zinc-800/50 rounded-lg bg-zinc-950/30 overflow-hidden">
        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, i) => {
            const from = nodes.find(n => n.id === conn.from);
            const to = nodes.find(n => n.id === conn.to);
            return (
              <motion.line
                key={i}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="rgba(16, 185, 129, 0.2)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: node.x, top: node.y }}
          >
            <div className={`p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center gap-1 shadow-xl hover:border-emerald-500/50 transition-colors`}>
              <div className={node.color}>{node.icon}</div>
              <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap uppercase tracking-tighter">{node.label}</span>
            </div>
          </motion.div>
        ))}

        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-[10px] text-zinc-600 font-medium">Neural connections mapped between environmental variables and yield outcome</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-2 rounded bg-zinc-800/20 border border-zinc-800">
          <p className="text-[10px] text-zinc-500 font-bold uppercase">Strong Correlation</p>
          <p className="text-xs text-zinc-300">Soil NPK ↔ Crop Stage</p>
        </div>
        <div className="p-2 rounded bg-zinc-800/20 border border-zinc-800">
          <p className="text-[10px] text-zinc-500 font-bold uppercase">Dynamic Influence</p>
          <p className="text-xs text-zinc-300">Humidity ↔ Pest Risk</p>
        </div>
      </div>
    </div>
  );
}
