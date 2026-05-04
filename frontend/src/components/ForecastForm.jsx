import { useStore } from '../store';
import { translations } from '../translations';
import { motion } from 'framer-motion';
import { Settings2, Zap } from 'lucide-react';
import axios from 'axios';

export default function ForecastForm() {
  const { formData, updateFormData, setPredictionResult, setIsPredicting, setPredictionError, isPredicting, language } = useStore();
  const t = translations[language];

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await axios.post('http://localhost:8000/api/predict', {
        crop_type: formData.crop_type,
        location: formData.location,
        soil_n: formData.soil_n,
        soil_p: formData.soil_p,
        soil_k: formData.soil_k,
        soil_ph: formData.soil_ph,
        soil_moisture: formData.soil_moisture
      });
      setPredictionResult(res.data);
    } catch (err) {
      setPredictionError(err.message);
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: isNaN(value) ? value : parseFloat(value) });
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Settings2 size={18} className="text-emerald-500" />
            {t.forecast_workspace}
          </h2>
          <p className="text-sm text-zinc-400">{t.forecast_desc}</p>
        </div>
      </div>

      <form onSubmit={handlePredict} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t.crop_type}</label>
            <select name="crop_type" value={formData.crop_type} onChange={handleChange} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 outline-none text-zinc-100 transition-colors">
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="maize">Maize</option>
              <option value="cotton">Cotton</option>
              <option value="soybean">Soybean</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t.region}</label>
            <select name="location" value={formData.location} onChange={handleChange} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 outline-none text-zinc-100 transition-colors">
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="Central">Central</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-2">{t.soil_nutrients}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">{t.nitrogen}</label>
              <input type="number" name="soil_n" value={formData.soil_n} onChange={handleChange} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 outline-none text-zinc-100" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">{t.phosphorus}</label>
              <input type="number" name="soil_p" value={formData.soil_p} onChange={handleChange} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 outline-none text-zinc-100" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">{t.potassium}</label>
              <input type="number" name="soil_k" value={formData.soil_k} onChange={handleChange} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 outline-none text-zinc-100" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-2">{t.environmental}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">{t.moisture}</label>
              <input type="number" name="soil_moisture" value={formData.soil_moisture} onChange={handleChange} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 outline-none text-zinc-100" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">{t.soil_ph}</label>
              <input type="number" name="soil_ph" step="0.1" value={formData.soil_ph} onChange={handleChange} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 outline-none text-zinc-100" />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isPredicting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
        >
          {isPredicting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Zap size={18} />
              {t.generate_forecast}
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
