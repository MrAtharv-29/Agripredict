import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import MetricsGrid from './components/MetricsGrid';
import ForecastForm from './components/ForecastForm';
import ExplainabilityPanel from './components/ExplainabilityPanel';
import AnalyticsCharts from './components/AnalyticsCharts';
import SatelliteMap from './components/SatelliteMap';
import ScenarioPlanner from './components/ScenarioPlanner';
import IoTSensorFeed from './components/IoTSensorFeed';
import AIChatbot from './components/AIChatbot';
import SmartAlerts from './components/SmartAlerts';
import ModelComparison from './components/ModelComparison';
import ReportTemplate from './components/ReportTemplate';
import EconomicsPanel from './components/EconomicsPanel';
import SustainabilityPanel from './components/SustainabilityPanel';
import MultiFarmComparison from './components/MultiFarmComparison';
import InsightGraph from './components/InsightGraph';
import { useStore } from './store';
import { translations } from './translations';

function App() {
  const { language, activeTab } = useStore();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        
        <main className="flex-1 p-6 md:p-8 md:ml-64 overflow-x-hidden" id="dashboard-content">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Area */}
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">{t.page_title}</h1>
                <p className="text-zinc-400">{t.page_subtitle}</p>
              </div>
            </div>

            {/* Top Level KPIs */}
            <MetricsGrid />

            {/* Main Content Area */}
            {activeTab === 'Dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-6 flex flex-col">
                  <SmartAlerts />
                  <InsightGraph />
                </div>
                <div className="lg:col-span-8 space-y-6 flex flex-col">
                  <SatelliteMap />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <IoTSensorFeed />
                    <ScenarioPlanner />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Forecast' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-6 flex flex-col">
                  <ForecastForm />
                </div>
                <div className="lg:col-span-7 space-y-6 flex flex-col">
                  <ExplainabilityPanel />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EconomicsPanel />
                    <SustainabilityPanel />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Benchmarks' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6 flex flex-col">
                  <AnalyticsCharts />
                  <ModelComparison />
                </div>
                
                <div className="lg:col-span-4 space-y-6 flex flex-col">
                  <MultiFarmComparison />
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
      
      {/* Global Floating Components */}
      <AIChatbot />
      
      {/* Hidden Print Template */}
      <ReportTemplate />
    </div>
  );
}

export default App;
