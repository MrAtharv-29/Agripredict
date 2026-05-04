import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart2 } from 'lucide-react';
import { useStore } from '../store';
import { translations } from '../translations';

const trendData = [
  { year: '2019', maize: 5.5, rice: 7.2, wheat: 4.8 },
  { year: '2020', maize: 6.0, rice: 7.4, wheat: 5.3 },
  { year: '2021', maize: 5.8, rice: 7.1, wheat: 5.0 },
  { year: '2022', maize: 6.2, rice: 7.5, wheat: 5.5 },
  { year: '2023', maize: 6.5, rice: 7.8, wheat: 5.8 },
];

const regionData = [
  { name: 'North', crop1: 4.2, crop2: 5.8 },
  { name: 'South', crop1: 5.0, crop2: 6.5 },
  { name: 'East', crop1: 4.0, crop2: 6.0 },
  { name: 'West', crop1: 5.2, crop2: 4.5 },
  { name: 'Central', crop1: 3.5, crop2: 6.2 },
];

const timeSeriesData = [
  { week: 'W1', projected: 0.5, actual: 0.5, stage: 'Germination' },
  { week: 'W2', projected: 1.2, actual: 1.1, stage: 'Vegetative' },
  { week: 'W4', projected: 2.8, actual: 2.6, stage: 'Vegetative' },
  { week: 'W6', projected: 4.5, actual: 4.3, stage: 'Flowering' },
  { week: 'W8', projected: 5.9, actual: null, stage: 'Grain Fill' },
  { week: 'W10', projected: 6.8, actual: null, stage: 'Maturation' },
  { week: 'W12', projected: 7.5, actual: null, stage: 'Harvest Ready' },
];

const priceForecastData = [
  { day: 'Day 1', price: 245 },
  { day: 'Day 5', price: 248 },
  { day: 'Day 10', price: 251 },
  { day: 'Day 15', price: 255 },
  { day: 'Day 20', price: 260 },
  { day: 'Day 25', price: 262 },
  { day: 'Day 30', price: 265 },
];

const yieldTrendData = [
  { day: '-30d', historical: 5.1, expected: 5.3 },
  { day: '-15d', historical: 5.2, expected: 5.4 },
  { day: 'Today', historical: 5.4, expected: 5.6 },
  { day: '+15d', historical: null, expected: 5.9 },
  { day: '+30d', historical: null, expected: 6.2 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
        <p className="text-zinc-300 text-sm mb-2 font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value} t/ha</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsCharts() {
  const { language } = useStore();
  const t = translations[language];

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm h-full">
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
        <BarChart2 size={18} className="text-emerald-500" />
        <h2 className="text-lg font-bold text-zinc-100">{t.data_viz}</h2>
      </div>

      <div className="space-y-8">
        {/* Time-Series Forecasting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-4">LSTM Projected Growth Stage (t/ha)</h3>
            <div className="h-64 w-full bg-zinc-800/20 p-4 rounded-xl border border-zinc-700/50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="week" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="projected" name="LSTM Projected" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="actual" name="Current Est." stroke="#10b981" strokeWidth={4} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-4">30-Day Yield Trend vs Historical</h3>
            <div className="h-64 w-full bg-zinc-800/20 p-4 rounded-xl border border-zinc-700/50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yieldTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="historical" name="Historical Avg" stroke="#71717a" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expected" name="Expected Trend" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Market Price & Line Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-4">Market Price Forecast ($/t)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceForecastData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="price" name="Est. Market Price" stroke="#eab308" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-4">{t.trend_chart}</h3>
            <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="year" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="maize" name="Maize" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="rice" name="Rice" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                <Line type="monotone" dataKey="wheat" name="Wheat" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

        {/* Bar Chart */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 mb-4">{t.region_chart}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.4 }} />
                <Bar dataKey="crop1" name="Crop Type A" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="crop2" name="Crop Type B" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
