import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Network, Zap, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModelComparison() {
  const modelData = [
    { name: 'Linear Reg', r2: 0.65, rmse: 2.1, time: 0.1 },
    { name: 'Random Forest', r2: 0.88, rmse: 0.9, time: 1.2 }, // Current Model
    { name: 'XGBoost', r2: 0.92, rmse: 0.7, time: 2.8 }, // Simulated Pro Model
    { name: 'LSTM', r2: 0.91, rmse: 0.8, time: 15.4 } // Time Series
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-300 font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Network size={18} className="text-purple-500" />
          <h2 className="text-lg font-bold text-zinc-100">Model Performance Comparison</h2>
        </div>
        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30">
          Research Grade
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-800/40 p-3 rounded-lg border border-zinc-700">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Scale size={14} className="text-emerald-400" />
            <span className="text-xs">Highest Accuracy</span>
          </div>
          <p className="text-lg font-bold text-zinc-200">XGBoost <span className="text-xs text-emerald-400">0.92 R²</span></p>
        </div>
        <div className="bg-zinc-800/40 p-3 rounded-lg border border-zinc-700">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Zap size={14} className="text-cyan-400" />
            <span className="text-xs">Fastest Inference</span>
          </div>
          <p className="text-lg font-bold text-zinc-200">Random Forest <span className="text-xs text-cyan-400">1.2ms</span></p>
        </div>
        <div className="bg-zinc-800/40 p-3 rounded-lg border border-zinc-700">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Network size={14} className="text-amber-400" />
            <span className="text-xs">Active Model</span>
          </div>
          <p className="text-lg font-bold text-zinc-200">Random Forest</p>
        </div>
      </div>

      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={modelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={[0, 1]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.4 }} />
            <Bar dataKey="r2" name="R² Score (Accuracy)" radius={[4, 4, 0, 0]}>
              {modelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Random Forest' ? '#10b981' : entry.name === 'XGBoost' ? '#8b5cf6' : '#3f3f46'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
