import { LayoutDashboard, LineChart, Sprout, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useStore();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: LineChart, label: 'Forecast' },
    { icon: BarChart3, label: 'Benchmarks' },
  ];

  return (
    <aside className="w-64 bg-[#18181b] border-r border-[#27272a] h-screen fixed left-0 top-0 flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-white font-bold">
          <Sprout size={20} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">AgriPredict</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item, idx) => (
          <motion.button
            key={idx}
            onClick={() => setActiveTab(item.label)}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.label 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </motion.button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
          <p className="text-xs text-zinc-400 mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-400">All Systems Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
