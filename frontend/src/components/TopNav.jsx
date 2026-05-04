import { Search, Bell, Download, Globe } from 'lucide-react';
import { useStore } from '../store';
import { translations } from '../translations';
import html2pdf from 'html2pdf.js';

export default function TopNav() {
  const { language, setLanguage, formData } = useStore();
  const t = translations[language];

  const handleExport = () => {
    const element = document.getElementById('print-report');
    if (!element) {
      alert("Please run a forecast first to generate a report.");
      return;
    }
    
    // Temporarily remove 'hidden' class to render the PDF
    element.classList.remove('hidden');
    
    const opt = {
      margin:       0.5,
      filename:     `AgriPredict_Report_${formData.crop_type}_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Hide it again after PDF is generated
      element.classList.add('hidden');
    });
  };

  return (
    <header className="h-16 border-b border-[#27272a] bg-[#18181b]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 md:ml-64">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input 
            type="text" 
            placeholder="Search farm records..." 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-1.5">
          <Globe size={16} className="text-zinc-400" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-sm text-zinc-300 outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        <button className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#18181b]"></span>
        </button>

        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
        >
          <Download size={16} />
          <span>{t.export_report}</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 border-2 border-zinc-800 cursor-pointer"></div>
      </div>
    </header>
  );
}
