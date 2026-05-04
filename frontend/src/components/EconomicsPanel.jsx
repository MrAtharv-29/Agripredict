import { useStore } from '../store';
import { TrendingUp, Wallet, ArrowDownRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EconomicsPanel() {
  const { predictionResult } = useStore();
  const profit = predictionResult?.profit_analysis;

  if (!profit) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-emerald-400" size={20} />
          Profit Optimization
        </h3>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
          Estimated {profit.profit_margin_percent}% Margin
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
          <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
            <Wallet size={12} /> Expected Revenue
          </p>
          <p className="text-xl font-bold text-zinc-100">₹{profit.expected_revenue.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
          <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
            <ArrowDownRight size={12} className="text-red-400" /> Input Costs
          </p>
          <p className="text-xl font-bold text-zinc-100">₹{profit.estimated_total_cost.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cost Breakdown</p>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(profit.cost_breakdown).map(([key, val]) => (
            <div key={key} className="flex justify-between items-center text-sm">
              <span className="text-zinc-400 capitalize">{key}</span>
              <span className="text-zinc-200 font-medium">₹{val.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-zinc-500">Net Expected Profit</p>
            <p className="text-2xl font-black text-emerald-400">₹{profit.expected_profit.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 flex items-center justify-end gap-1">
              <Tag size={12} /> Market Price
            </p>
            <p className="text-sm font-bold text-zinc-300">₹{profit.market_price_per_ton}/ton</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
