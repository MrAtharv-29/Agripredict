// AgriPredict Dashboard Scripts

const translations = {
    en: {
        platform_sub: "AGRIPREDICT YIELD ANALYTICS PLATFORM",
        page_title: "Predictive Yield Modeling",
        page_subtitle: "Forecast harvest volume from crop, weather, nutrient, soil, and IoT signals.",
        download_report: "Download Report",
        top_crop: "Top crop", regions: "Regions", crop_num: "Crop #", model: "Model",
        sys_ready: "System ready for yield forecasting",
        sys_desc: "Dataset, model, and metrics are ready",
        predicted_yield: "Predicted Yield",
        total_harvest: "Total Harvest",
        risk_level: "Risk Level",
        confidence_band: "Confidence Band",
        soil_health: "Soil Health",
        best_benchmark: "Best Crop Benchmark",
        top_region: "Top Region for selected crop",
        dataset_cov: "Dataset Coverage",
        tons_per_ha: "tons per hectare",
        estimated_tons: "estimated tons",
        yield_range: "yield range",
        soil_health_desc: "base NPK need in some fields",
        quick_start: "QUICK START", field_presets: "Field Presets",
        preset_rice: "Rice Wetland", preset_wheat: "Wheat Cereal", preset_maize: "Maize Drip", preset_cotton: "Cotton Dryland",
        forecast_workspace: "FORECAST WORKSPACE", harvest_volume: "Harvest Volume",
        crop_region: "CROP & REGION", lbl_crop: "Crop", lbl_region: "Region",
        lbl_soil: "Soil Type", lbl_irrigation: "Irrigation", lbl_year: "Year", lbl_area: "Area (ha)",
        field_signals: "FIELD SIGNALS", lbl_temp: "Temperature (C)", lbl_rain: "Rainfall (mm)",
        lbl_humidity: "Humidity %", lbl_ph: "Soil pH", lbl_sun: "Sunlight hrs/day", lbl_ndvi: "NDVI",
        nutrients: "NUTRIENTS", lbl_prev_yield: "Prev Yield (t/ha)", btn_predict: "Enter field conditions and run a forecast.",
        action_plan_title: "ACTION PLAN", action_plan: "Action Plan", action_waiting: "Awaiting forecast to generate irrigation, nutrient, and monitoring tasks.",
        validation: "VALIDATION", model_perf: "Model Performance",
        explainability: "EXPLAINABILITY", feature_impact: "Feature Impact", impact_waiting: "Run a forecast to view AI insights on feature impact.",
        what_if: "WHAT-IF", scenario_planner: "Scenario Planner", run_scenarios: "Run Scenarios", scenario_waiting: "No scenarios run yet. Adjust parameters to see what-if differences.",
        geospatial: "GEOSPATIAL", satellite_map: "Satellite & NDVI Map",
        chart_trend: "Average Yield Trend by Crop", chart_region: "Regional Yield Comparison", chart_heatmap: "Soil and Irrigation Yield Matrix",
        dataset: "DATASET", sample_data: "Sample Processed Data",
        th_year: "YEAR", th_crop: "CROP", th_region: "REGION", th_rain: "RAINFALL", th_ndvi: "NDVI", th_yield: "YIELD",
        simulated: "SIMULATED", conditions: "Conditions",
        live_data: "LIVE DATA", iot_feed: "IoT Sensor Feed", iot_device: "Device", iot_moisture: "Moisture", iot_temp: "Soil Temp", iot_received: "Received", btn_sim_reading: "Simulate Sensor Reading",
        real_world: "REAL-WORLD", leaderboard: "Crop Leaderboard",
        crop_maize: "Maize", crop_rice: "Rice", crop_wheat: "Wheat", crop_soybean: "Soybean", crop_cotton: "Cotton",
        log: "LOG", recent_activity: "Recent Activity", log_1: "Regional health check passed.", log_2: "Dashboard loaded successfully.",
        reg_north: "North", reg_south: "South", reg_east: "East", reg_west: "West", reg_central: "Central",
        soil_alluvial: "Alluvial", soil_black: "Black", soil_red: "Red", soil_loamy: "Loamy",
        irr_rainfed: "Rainfed", irr_canal: "Canal", irr_tubewell: "Tubewell"
    },
    hi: {
        platform_sub: "एग्रीप्रेडिक्ट उपज एनालिटिक्स प्लेटफॉर्म",
        page_title: "अनुमानित उपज मॉडलिंग",
        page_subtitle: "फसल, मौसम, पोषक तत्व, मिट्टी और IoT संकेतों से फसल की मात्रा का अनुमान लगाएं।",
        download_report: "रिपोर्ट डाउनलोड करें",
        top_crop: "शीर्ष फसल", regions: "क्षेत्र", crop_num: "फसल संख्या", model: "मॉडल",
        sys_ready: "सिस्टम उपज पूर्वानुमान के लिए तैयार है",
        sys_desc: "डेटासेट, मॉडल और मेट्रिक्स तैयार हैं",
        predicted_yield: "अनुमानित उपज", total_harvest: "कुल फसल", risk_level: "जोखिम स्तर", confidence_band: "विश्वास सीमा",
        soil_health: "मिट्टी का स्वास्थ्य", best_benchmark: "सर्वश्रेष्ठ फसल बेंचमार्क", top_region: "चयनित फसल के लिए शीर्ष क्षेत्र", dataset_cov: "डेटासेट कवरेज",
        tons_per_ha: "टन प्रति हेक्टेयर", estimated_tons: "अनुमानित टन", yield_range: "उपज सीमा", soil_health_desc: "कुछ क्षेत्रों में एनपीके (NPK) की आवश्यकता",
        quick_start: "त्वरित प्रारंभ", field_presets: "खेत के प्रीसेट",
        preset_rice: "चावल (गीला)", preset_wheat: "गेहूँ", preset_maize: "मक्का (ड्रिप)", preset_cotton: "कपास (सूखा)",
        forecast_workspace: "पूर्वानुमान कार्यक्षेत्र", harvest_volume: "फसल की मात्रा",
        crop_region: "फसल और क्षेत्र", lbl_crop: "फसल", lbl_region: "क्षेत्र",
        lbl_soil: "मिट्टी का प्रकार", lbl_irrigation: "सिंचाई", lbl_year: "वर्ष", lbl_area: "क्षेत्र (हेक्टेयर)",
        field_signals: "खेत के संकेत", lbl_temp: "तापमान (C)", lbl_rain: "वर्षा (मिमी)",
        lbl_humidity: "नमी %", lbl_ph: "मिट्टी का pH", lbl_sun: "धूप (घंटे/दिन)", lbl_ndvi: "NDVI",
        nutrients: "पोषक तत्व", lbl_prev_yield: "पिछली उपज (टन/हेक्टेयर)", btn_predict: "खेत की स्थिति दर्ज करें और पूर्वानुमान चलाएं।",
        action_plan_title: "कार्य योजना", action_plan: "कार्य योजना", action_waiting: "सिंचाई, पोषक तत्व और निगरानी कार्य उत्पन्न करने के लिए पूर्वानुमान की प्रतीक्षा कर रहा है।",
        validation: "सत्यापन", model_perf: "मॉडल का प्रदर्शन",
        explainability: "व्याख्यात्मकता", feature_impact: "विशेषता का प्रभाव", impact_waiting: "विशेषता के प्रभाव पर AI अंतर्दृष्टि देखने के लिए पूर्वानुमान चलाएं।",
        what_if: "क्या होगा यदि", scenario_planner: "परिदृश्य योजनाकार", run_scenarios: "परिदृश्य चलाएं", scenario_waiting: "अभी तक कोई परिदृश्य नहीं चला है।",
        geospatial: "भू-स्थानिक", satellite_map: "सैटेलाइट और NDVI मानचित्र",
        chart_trend: "फसल के अनुसार औसत उपज की प्रवृत्ति", chart_region: "क्षेत्रीय उपज तुलना", chart_heatmap: "मिट्टी और सिंचाई उपज मैट्रिक्स",
        dataset: "डेटासेट", sample_data: "नमूना प्रसंस्कृत डेटा",
        th_year: "वर्ष", th_crop: "फसल", th_region: "क्षेत्र", th_rain: "वर्षा", th_ndvi: "NDVI", th_yield: "उपज",
        simulated: "सिम्युलेटेड", conditions: "स्थितियां",
        live_data: "लाइव डेटा", iot_feed: "IoT सेंसर फ़ीड", iot_device: "डिवाइस", iot_moisture: "नमी", iot_temp: "मिट्टी का तापमान", iot_received: "प्राप्त हुआ", btn_sim_reading: "सेंसर रीडिंग का अनुकरण करें",
        real_world: "वास्तविक दुनिया", leaderboard: "फसल लीडरबोर्ड",
        crop_maize: "मक्का", crop_rice: "चावल", crop_wheat: "गेहूँ", crop_soybean: "सोयाबीन", crop_cotton: "कपास",
        log: "लॉग", recent_activity: "हाल की गतिविधि", log_1: "क्षेत्रीय स्वास्थ्य जांच उत्तीर्ण।", log_2: "डैशबोर्ड सफलतापूर्वक लोड हो गया।",
        reg_north: "उत्तर", reg_south: "दक्षिण", reg_east: "पूर्व", reg_west: "पश्चिम", reg_central: "मध्य",
        soil_alluvial: "जलोढ़", soil_black: "काली", soil_red: "लाल", soil_loamy: "दोमट",
        irr_rainfed: "वर्षा आधारित", irr_canal: "नहर", irr_tubewell: "ट्यूबवेल"
    },
    mr: {
        platform_sub: "अॅग्रीप्रेडिक्ट उत्पन्न विश्लेषिकी प्लॅटफॉर्म",
        page_title: "अंदाजित उत्पन्न मॉडेलिंग",
        page_subtitle: "पीक, हवामान, पोषक तत्त्वे, माती आणि IoT संकेतांवरून कापणीच्या प्रमाणाचा अंदाज लावा.",
        download_report: "अहवाल डाउनलोड करा",
        top_crop: "अव्वल पीक", regions: "प्रदेश", crop_num: "पीक क्र.", model: "मॉडेल",
        sys_ready: "सिस्टम उत्पन्न अंदाजासाठी तयार आहे",
        sys_desc: "डेटासेट, मॉडेल आणि मेट्रिक्स तयार आहेत",
        predicted_yield: "अपेक्षित उत्पन्न", total_harvest: "एकूण कापणी", risk_level: "धोका पातळी", confidence_band: "आत्मविश्वास श्रेणी",
        soil_health: "मातीचे आरोग्य", best_benchmark: "सर्वोत्तम पीक बेंचमार्क", top_region: "निवडलेल्या पिकासाठी शीर्ष प्रदेश", dataset_cov: "डेटासेट कव्हरेज",
        tons_per_ha: "टन प्रति हेक्टर", estimated_tons: "अंदाजे टन", yield_range: "उत्पन्न श्रेणी", soil_health_desc: "काही शेतांमध्ये NPK ची आवश्यकता",
        quick_start: "त्वरित प्रारंभ", field_presets: "शेतीचे प्रीसेट",
        preset_rice: "तांदूळ", preset_wheat: "गहू", preset_maize: "मका (ठिबक)", preset_cotton: "कापूस (कोरडवाहू)",
        forecast_workspace: "अंदाज कार्यक्षेत्र", harvest_volume: "कापणीचे प्रमाण",
        crop_region: "पीक आणि प्रदेश", lbl_crop: "पीक", lbl_region: "प्रदेश",
        lbl_soil: "मातीचा प्रकार", lbl_irrigation: "सिंचन", lbl_year: "वर्ष", lbl_area: "क्षेत्र (हेक्टर)",
        field_signals: "शेतातील संकेत", lbl_temp: "तापमान (C)", lbl_rain: "पाऊस (मिमी)",
        lbl_humidity: "आर्द्रता %", lbl_ph: "मातीचा pH", lbl_sun: "सूर्यप्रकाश (तास/दिवस)", lbl_ndvi: "NDVI",
        nutrients: "पोषक तत्त्वे", lbl_prev_yield: "मागील उत्पन्न (टन/हेक्टर)", btn_predict: "शेताची स्थिती प्रविष्ट करा आणि अंदाज चालवा.",
        action_plan_title: "कृती योजना", action_plan: "कृती योजना", action_waiting: "अंदाजाची वाट पाहत आहे...",
        validation: "प्रमाणीकरण", model_perf: "मॉडेलची कामगिरी",
        explainability: "स्पष्टीकरण", feature_impact: "वैशिष्ट्यांचा प्रभाव", impact_waiting: "माहिती पाहण्यासाठी अंदाज चालवा.",
        what_if: "जर-तर", scenario_planner: "परिदृश्य नियोजक", run_scenarios: "परिदृश्य चालवा", scenario_waiting: "अद्याप कोणतेही परिदृश्य चालवले नाही.",
        geospatial: "भू-स्थानिक", satellite_map: "उपग्रह आणि NDVI नकाशा",
        chart_trend: "पिकांनुसार सरासरी उत्पन्न कल", chart_region: "प्रादेशिक उत्पन्न तुलना", chart_heatmap: "माती आणि सिंचन उत्पन्न मॅट्रिक्स",
        dataset: "डेटासेट", sample_data: "नमुना प्रक्रिया केलेला डेटा",
        th_year: "वर्ष", th_crop: "पीक", th_region: "प्रदेश", th_rain: "पाऊस", th_ndvi: "NDVI", th_yield: "उत्पन्न",
        simulated: "सिम्युलेटेड", conditions: "स्थिती",
        live_data: "थेट डेटा", iot_feed: "IoT सेन्सर फीड", iot_device: "डिव्हाइस", iot_moisture: "आर्द्रता", iot_temp: "मातीचे तापमान", iot_received: "प्राप्त", btn_sim_reading: "सेन्सर रीडिंग अनुकरण करा",
        real_world: "वास्तविक जग", leaderboard: "पीक लीडरबोर्ड",
        crop_maize: "मका", crop_rice: "तांदूळ", crop_wheat: "गहू", crop_soybean: "सोयाबीन", crop_cotton: "कापूस",
        log: "लॉग", recent_activity: "अलीकडील क्रियाकलाप", log_1: "प्रादेशिक आरोग्य तपासणी उत्तीर्ण.", log_2: "डॅशबोर्ड यशस्वीरित्या लोड झाला.",
        reg_north: "उत्तर", reg_south: "दक्षिण", reg_east: "पूर्व", reg_west: "पश्चिम", reg_central: "मध्य",
        soil_alluvial: "गाळाची", soil_black: "काळी", soil_red: "लाल", soil_loamy: "पोयटा",
        irr_rainfed: "कोरडवाहू", irr_canal: "कालवा", irr_tubewell: "विहीर"
    }
};

let currentLang = 'en';
function changeLanguage() {
    currentLang = document.getElementById("lang").value;
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });
}

function exportReport() {
    const element = document.getElementById('export-content');
    const opt = {
        margin: 0.5,
        filename: `AgriPredict_Report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}


const cropBaselines = {
    wheat: { crop_type: 'wheat', region: 'North', soil_type: 'loamy', irrigation: 'Canal', temperature: 20, rainfall: 100, humidity: 50, soil_ph: 6.5, sunlight: 8, ndvi: 0.6, soil_n: 60, soil_p: 40, soil_k: 30, prev_yield: 4.5 },
    rice: { crop_type: 'rice', region: 'South', soil_type: 'alluvial', irrigation: 'Rainfed', temperature: 28, rainfall: 250, humidity: 80, soil_ph: 6.0, sunlight: 7, ndvi: 0.75, soil_n: 80, soil_p: 50, soil_k: 40, prev_yield: 6.0 },
    maize: { crop_type: 'maize', region: 'Central', soil_type: 'black', irrigation: 'Tubewell', temperature: 25, rainfall: 150, humidity: 65, soil_ph: 6.8, sunlight: 9, ndvi: 0.7, soil_n: 90, soil_p: 45, soil_k: 40, prev_yield: 5.0 },
    cotton: { crop_type: 'cotton', region: 'West', soil_type: 'black', irrigation: 'Rainfed', temperature: 30, rainfall: 120, humidity: 60, soil_ph: 7.0, sunlight: 10, ndvi: 0.55, soil_n: 50, soil_p: 30, soil_k: 40, prev_yield: 3.5 }
};

document.addEventListener("DOMContentLoaded", () => {
    initCharts();
    initMap();
    setupForm();
    updateSimulatedConditions();
    updateTimestamp();
});

let farmMap = null;
let mapPolygon = null;

function initMap() {
    const mapEl = document.getElementById('farm-map');
    if (!mapEl || typeof L === 'undefined') return;
    
    // Default to central India
    farmMap = L.map('farm-map').setView([21.1458, 79.0882], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(farmMap);
}

function updateMapForRegion(regionName, ndviValue) {
    if (!farmMap) return;
    
    const regionCoords = {
        'North': [28.7041, 77.1025], // Delhi/Punjab
        'South': [13.0827, 80.2707], // Chennai/TN
        'East': [22.5726, 88.3639],  // Kolkata
        'West': [19.0760, 72.8777],  // Mumbai/MH
        'Central': [21.1458, 79.0882] // Nagpur
    };
    
    const coords = regionCoords[regionName] || regionCoords['Central'];
    farmMap.flyTo(coords, 10);
    
    if (mapPolygon) {
        farmMap.removeLayer(mapPolygon);
    }
    
    // Create a mock polygon representing a farm
    const bounds = [
        [coords[0] - 0.05, coords[1] - 0.05],
        [coords[0] + 0.05, coords[1] + 0.05]
    ];
    
    // Color based on NDVI (higher = greener)
    let polyColor = '#facc15'; // Yellow (low)
    if (ndviValue > 0.6) polyColor = '#22c55e'; // Green (good)
    if (ndviValue > 0.8) polyColor = '#15803d'; // Dark Green (excellent)
    if (ndviValue < 0.4) polyColor = '#ef4444'; // Red (poor)

    mapPolygon = L.rectangle(bounds, {color: polyColor, weight: 1, fillOpacity: 0.6}).addTo(farmMap);
    mapPolygon.bindPopup(`<b>${regionName} Farm</b><br>NDVI Scan: ${ndviValue}`).openPopup();
}

function applyPreset(type) {
    const preset = cropBaselines[type];
    if (!preset) return;
    
    document.getElementById('crop_type').value = preset.crop_type;
    document.getElementById('region').value = preset.region;
    document.getElementById('soil_type').value = preset.soil_type;
    document.getElementById('irrigation').value = preset.irrigation;
    
    document.getElementById('temperature').value = preset.temperature;
    document.getElementById('rainfall').value = preset.rainfall;
    document.getElementById('humidity').value = preset.humidity;
    document.getElementById('soil_ph').value = preset.soil_ph;
    document.getElementById('sunlight').value = preset.sunlight;
    document.getElementById('ndvi').value = preset.ndvi;
    
    document.getElementById('soil_n').value = preset.soil_n;
    document.getElementById('soil_p').value = preset.soil_p;
    document.getElementById('soil_k').value = preset.soil_k;
    document.getElementById('prev_yield').value = preset.prev_yield;
    
    updateSimulatedConditions();
}

function updateSimulatedConditions() {
    const temp = document.getElementById('temperature').value;
    const hum = document.getElementById('humidity').value;
    const rain = document.getElementById('rainfall').value;
    
    document.getElementById('sim-temp').innerText = `${temp} °C`;
    document.getElementById('bar-temp').style.width = `${Math.min(100, temp * 2)}%`;
    
    document.getElementById('sim-hum').innerText = `${hum} %`;
    document.getElementById('bar-hum').style.width = `${Math.min(100, hum)}%`;
    
    document.getElementById('sim-rain').innerText = `${rain} mm`;
    document.getElementById('bar-rain').style.width = `${Math.min(100, rain / 4)}%`;
}

document.getElementById('prediction-form').addEventListener('input', updateSimulatedConditions);

function updateTimestamp() {
    const el = document.getElementById('iot-time');
    if (el) {
        const d = new Date();
        el.innerText = d.toISOString().replace('T', ' ').split('.')[0] + '+00:00';
    }
}

function setupForm() {
    const form = document.getElementById('prediction-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Analyzing variables...";
        submitBtn.disabled = true;

        const requestData = {
            crop_type: document.getElementById('crop_type').value,
            location: document.getElementById('region').value,
            soil_n: parseFloat(document.getElementById('soil_n').value),
            soil_p: parseFloat(document.getElementById('soil_p').value),
            soil_k: parseFloat(document.getElementById('soil_k').value),
            soil_ph: parseFloat(document.getElementById('soil_ph').value),
            soil_moisture: parseFloat(document.getElementById('humidity').value)
        };

        try {
            const predRes = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            const prediction = await predRes.json();
            
            // Map results to the new grid
            document.getElementById('res-yield').innerText = prediction.yield_prediction;
            
            const area = parseFloat(document.getElementById('area').value) || 1;
            const totalHarvest = parseFloat(prediction.yield_prediction) * area;
            document.getElementById('res-harvest').innerText = totalHarvest.toFixed(2);
            
            document.getElementById('res-risk').innerText = prediction.risk_level;
            
            // Generate mock confidence band based on yield
            const lowerBound = (parseFloat(prediction.yield_prediction) * 0.9).toFixed(2);
            const upperBound = (parseFloat(prediction.yield_prediction) * 1.1).toFixed(2);
            document.getElementById('res-confidence').innerText = `${lowerBound} - ${upperBound}`;
            
            document.getElementById('res-top-region').innerText = requestData.location;

            // Update Map
            const ndviVal = parseFloat(document.getElementById('ndvi').value) || 0.5;
            updateMapForRegion(requestData.location, ndviVal);

            // 1. Action Plan
            const actionList = document.getElementById('action-plan-list');
            if (actionList && prediction.recommendations) {
                actionList.innerHTML = '';
                if (prediction.recommendations.length > 0) {
                    prediction.recommendations.forEach(rec => {
                        const li = document.createElement('li');
                        li.innerText = rec;
                        actionList.appendChild(li);
                    });
                } else {
                    actionList.innerHTML = '<li>No immediate actions required based on current parameters.</li>';
                }
            }

            // 2. Feature Impact
            const featureContainer = document.getElementById('feature-impact-container');
            if (featureContainer && prediction.explainability_insights) {
                if (prediction.explainability_plot_url) {
                    featureContainer.innerHTML = `<img src="${prediction.explainability_plot_url}?t=${new Date().getTime()}" alt="Feature Impact Plot" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-color);">`;
                } else {
                    let html = '<ul style="list-style-type: none; padding: 0; font-size: 0.875rem;">';
                    prediction.explainability_insights.forEach(insight => {
                        html += `<li style="margin-bottom: 0.5rem; padding: 0.75rem; background: var(--bg-main); border-radius: 4px;">${insight}</li>`;
                    });
                    html += '</ul>';
                    featureContainer.innerHTML = html;
                }
            }

            // 3. Scenario Planner
            const scenarioContainer = document.getElementById('scenario-container');
            if (scenarioContainer) {
                const yieldVal = parseFloat(prediction.yield_prediction);
                const nImpact = yieldVal * 1.05; // mock +5%
                const waterImpact = yieldVal * 0.92; // mock -8%
                
                scenarioContainer.innerHTML = `
                    <div style="font-size: 0.875rem;">
                        <p style="margin-bottom: 0.5rem; color: var(--text-main);"><strong>Current Baseline:</strong> ${yieldVal} t/ha</p>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                            <span>+20% Nitrogen (N)</span>
                            <span style="color: var(--green-accent);">~${nImpact.toFixed(2)} t/ha</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                            <span>-15% Rainfall</span>
                            <span style="color: #ef4444;">~${waterImpact.toFixed(2)} t/ha</span>
                        </div>
                    </div>
                `;
            }

        } catch (error) {
            console.error("Prediction failed:", error);
            alert("Failed to get prediction from backend.");
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}

// --- Charting ---
function initCharts() {
    // Shared styling
    Chart.defaults.color = '#6B7280';
    Chart.defaults.font.family = 'Inter';
    const gridColor = '#F3F4F6';

    // 1. Average Yield Trend by Crop (Line)
    const ctxTrend = document.getElementById('trendChart');
    if (ctxTrend) {
        new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
                datasets: [
                    { label: 'Maize', data: [5.2, 5.5, 6.0, 5.8, 6.2, 6.5], borderColor: '#10B981', fill: false, tension: 0.3 },
                    { label: 'Rice', data: [6.8, 7.2, 7.4, 7.1, 7.5, 7.8], borderColor: '#059669', fill: false, tension: 0.3 },
                    { label: 'Wheat', data: [4.5, 4.8, 5.3, 5.0, 5.5, 5.8], borderColor: '#F59E0B', fill: false, tension: 0.3 },
                    { label: 'Soybean', data: [3.8, 4.0, 4.2, 4.5, 4.8, 5.0], borderColor: '#3B82F6', fill: false, tension: 0.3 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } },
                scales: { 
                    y: { title: { display: true, text: 'yield_tons_per_hectare' }, grid: { color: gridColor } },
                    x: { title: { display: true, text: 'year' }, grid: { display: false } }
                }
            }
        });
    }

    // 2. Regional Yield Comparison (Bar)
    const ctxRegion = document.getElementById('regionalChart');
    if (ctxRegion) {
        new Chart(ctxRegion, {
            type: 'bar',
            data: {
                labels: ['Central', 'East', 'North', 'South'],
                datasets: [
                    { label: 'Crop 1', data: [3.5, 4.0, 4.2, 5.0], backgroundColor: '#185B42' },
                    { label: 'Crop 2', data: [6.2, 6.0, 5.8, 6.5], backgroundColor: '#2A8B63' },
                    { label: 'Crop 3', data: [5.0, 4.8, 5.5, 4.5], backgroundColor: '#10B981' },
                    { label: 'Crop 4', data: [4.2, 4.5, 4.0, 5.2], backgroundColor: '#F59E0B' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { usePointStyle: true } } },
                scales: {
                    y: { title: { display: true, text: 'yield_tons_per_hectare' }, grid: { color: gridColor } },
                    x: { title: { display: true, text: 'region' }, grid: { display: false } }
                }
            }
        });
    }

    // 3. Heatmap Mock (using stacked bar to simulate)
    const ctxHeatmap = document.getElementById('heatmapChart');
    if (ctxHeatmap) {
        // Simple mock since Chart.js doesn't have native simple heatmap without matrix plugin
        new Chart(ctxHeatmap, {
            type: 'bar',
            data: {
                labels: ['Alluvial', 'Black', 'Loamy'],
                datasets: [
                    { label: 'Canal', data: [6.5, 7.0, 5.5], backgroundColor: '#185B42' },
                    { label: 'Rainfed', data: [4.5, 5.0, 4.0], backgroundColor: '#2A8B63' },
                    { label: 'Tubewell', data: [7.5, 8.0, 6.5], backgroundColor: '#10B981' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                indexAxis: 'y', // horizontal
                plugins: { legend: { position: 'bottom', title: {display: true, text: 'Irrigation Type'} } },
                scales: {
                    x: { stacked: true, title: { display: true, text: 'Yield Output representation' }, grid: { color: gridColor } },
                    y: { stacked: true, title: { display: true, text: 'Soil Type' }, grid: { display: false } }
                }
            }
        });
    }
}
