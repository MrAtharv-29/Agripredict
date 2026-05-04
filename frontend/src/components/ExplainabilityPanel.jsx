import { useStore } from '../store';
import { translations } from '../translations';
import { Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export default function ExplainabilityPanel() {
  const { predictionResult, language } = useStore();
  const t = translations[language];

  // Mocking visual data based on the text insights since the current backend returns text arrays
  const mockImpactData = [
    { name: 'Nitrogen', impact: 24.5 },
    { name: 'Phosphorus', impact: 12.0 },
    { name: 'Potassium', impact: 8.5 },
    { name: 'Rainfall', impact: -12.4 },
    { name: 'Soil pH', impact: -5.2 },
  ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPositive = data.impact > 0;
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-300 text-sm font-medium mb-1">{data.name}</p>
          <p className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{data.impact}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
        <Sparkles size={18} className="text-amber-400" />
        <h2 className="text-lg font-bold text-zinc-100">{t.ai_insights || "AI Insights & Explainability"}</h2>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          {!predictionResult ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-3 pt-10"
            >
              <Activity size={32} className="opacity-20" />
              <p className="text-sm">{t.run_forecast || "Run a forecast to view AI insights"}</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Feature Impact Visual */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-emerald-500" />
                  {t.feature_impact || "Feature Impact Analysis"}
                </h3>
                <div className="h-64 w-full bg-zinc-800/20 rounded-xl p-4 border border-zinc-700/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={mockImpactData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} width={80} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.4 }} />
                      <ReferenceLine x={0} stroke="#3f3f46" />
                      <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={20}>
                        {mockImpactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#10b981' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action Plan */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {t.recommended_actions || "Recommended Actions"}
                </h3>
                <div className="space-y-2">
                  {predictionResult.recommendations?.map((rec, idx) => (
                    <div key={idx} className="flex gap-3 bg-zinc-800/40 border border-emerald-500/20 rounded-lg p-3 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
