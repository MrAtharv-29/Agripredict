import { motion } from 'framer-motion';
import { useStore } from '../store';
import { translations } from '../translations';
import { TrendingUp, AlertTriangle, Scale, Sprout, ArrowUpRight, DollarSign, Leaf } from 'lucide-react';

export default function MetricsGrid() {
  const { predictionResult, language } = useStore();
  const t = translations[language];

  const metrics = [
    {
      title: t.predicted_yield,
      value: predictionResult ? `${predictionResult.yield_prediction} t/ha` : '--',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      title: t.total_harvest,
      value: predictionResult ? `${(predictionResult.yield_prediction * 5).toFixed(1)} tons` : '--', // Mock area 5ha
      icon: Sprout,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    },
    {
      title: t.risk_level,
      value: predictionResult ? predictionResult.risk_level : '--',
      icon: AlertTriangle,
      color: predictionResult?.risk_level === 'High' ? 'text-red-400' : 'text-amber-400',
      bg: predictionResult?.risk_level === 'High' ? 'bg-red-500/10' : 'bg-amber-500/10'
    },
    {
      title: t.confidence || 'Confidence',
      value: predictionResult ? `${predictionResult.confidence_score}%` : '--',
      icon: Scale,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      title: 'Est. Profit',
      value: predictionResult?.profit_analysis ? `₹${predictionResult.profit_analysis.expected_profit.toLocaleString()}` : '--',
      icon: DollarSign,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10'
    },
    {
      title: 'Sustainability',
      value: predictionResult?.sustainability_score ? `${predictionResult.sustainability_score.overall_score}/100` : '--',
      icon: Leaf,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {metrics.map((m, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <m.icon size={48} className={m.color} />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-400">{m.title}</h3>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.bg} ${m.color}`}>
              <m.icon size={16} />
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-100 tracking-tight">{m.value}</span>
          </div>
          
          <div className="mt-4 flex items-center text-xs text-zinc-500 gap-1">
            <ArrowUpRight size={14} className="text-emerald-500" />
            <span>{t.updated_now}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
