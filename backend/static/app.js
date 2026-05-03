// --- Translation Dictionary ---
const translations = {
    en: {
        nav_dashboard: "Dashboard",
        nav_history: "History",
        nav_settings: "Settings",
        language: "Language",
        page_title: "Yield Prediction Dashboard",
        page_subtitle: "AI-powered insights for your farm.",
        farm_details: "Farm Details",
        crop_type: "Crop Type",
        crop_wheat: "Wheat",
        crop_rice: "Rice",
        crop_cotton: "Cotton",
        crop_sugarcane: "Sugarcane",
        location: "Location / Region",
        moisture: "Soil Moisture (%)",
        btn_predict: "Predict Yield",
        predicted_yield: "Predicted Yield",
        confidence: "AI Confidence",
        risk_analysis: "Risk & Analysis",
        smart_recommendations: "Smart Recommendations",
        waiting_input: "Awaiting farm details to generate insights...",
        weather_forecast: "7-Day Weather Forecast"
    },
    hi: { /* shortened for brevity, keeping same logic */
        nav_dashboard: "डैशबोर्ड", nav_history: "इतिहास", nav_settings: "सेटिंग्स", language: "भाषा", page_title: "उपज भविष्यवाणी डैशबोर्ड", page_subtitle: "आपके खेत के लिए AI-संचालित जानकारी।", farm_details: "खेत का विवरण", crop_type: "फसल का प्रकार", crop_wheat: "गेहूँ", crop_rice: "चावल", crop_cotton: "कपास", crop_sugarcane: "गन्ना", location: "स्थान / क्षेत्र", moisture: "मिट्टी की नमी (%)", btn_predict: "उपज की भविष्यवाणी करें", predicted_yield: "अनुमानित उपज", confidence: "AI विश्वास", risk_analysis: "जोखिम और विश्लेषण", smart_recommendations: "स्मार्ट सिफारिशें", waiting_input: "जानकारी उत्पन्न करने के लिए खेत के विवरण की प्रतीक्षा की जा रही है...", weather_forecast: "7-दिन का मौसम पूर्वानुमान"
    },
    mr: {
        nav_dashboard: "डॅशबोर्ड", nav_history: "इतिहास", nav_settings: "सेटिंग्ज", language: "भाषा", page_title: "उत्पन्न अंदाज डॅशबोर्ड", page_subtitle: "तुमच्या शेतासाठी AI-सक्षम माहिती.", farm_details: "शेतीचा तपशील", crop_type: "पिकाचा प्रकार", crop_wheat: "गहू", crop_rice: "तांदूळ", crop_cotton: "कापूस", crop_sugarcane: "ऊस", location: "स्थान / प्रदेश", moisture: "मातीची आर्द्रता (%)", btn_predict: "उत्पन्नाचा अंदाज घ्या", predicted_yield: "अपेक्षित उत्पन्न", confidence: "AI आत्मविश्वास", risk_analysis: "धोका आणि विश्लेषण", smart_recommendations: "स्मार्ट शिफारसी", waiting_input: "माहिती तयार करण्यासाठी शेताच्या तपशीलाची वाट पाहत आहे...", weather_forecast: "७-दिवसांचा हवामान अंदाज"
    }
};

let currentLang = 'en';
let weatherChartInstance = null;
let radarChartInstance = null;
let predictionHistory = JSON.parse(localStorage.getItem('agripredict_history')) || [];

// Baselines for radar chart
const cropBaselines = {
    wheat: { n: 60, p: 40, k: 30, ph: 6.5, moisture: 50 },
    rice: { n: 80, p: 50, k: 40, ph: 6.0, moisture: 80 },
    cotton: { n: 50, p: 30, k: 40, ph: 7.0, moisture: 40 },
    sugarcane: { n: 100, p: 60, k: 60, ph: 7.5, moisture: 70 }
};

// --- Initialize App ---
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    setupNavigation();
    setupForm();
    setupGeolocation();
    setupSettings();
    renderHistory();
    loadWeatherData("Pune"); // Default location load
});

// --- Navigation ---
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            views.forEach(view => {
                if (view.id === `view-${targetId}`) {
                    view.style.display = 'block';
                    setTimeout(() => view.classList.add('active'), 10);
                } else {
                    view.classList.remove('active');
                    view.style.display = 'none';
                }
            });
            
            if (targetId === 'history') renderHistory();
            if (targetId === 'analytics') loadCorrelationStats();
            if (targetId === 'admin') loadAdminStats();
        });
    });
}

// --- Analytics Panel ---
let correlationChartInstance = null;

async function loadCorrelationStats() {
    try {
        const res = await fetch('/api/analytics/correlation');
        const data = await res.json();
        if (data.status === 'success' && data.correlation_matrix && data.correlation_matrix.predicted_yield) {
            const yieldCorrs = data.correlation_matrix.predicted_yield;
            delete yieldCorrs['predicted_yield']; // remove self correlation
            renderCorrelationChart(yieldCorrs);
        } else {
            console.log("Not enough data for correlation chart");
        }
    } catch(e) {
        console.error("Failed to load correlation stats", e);
    }
}

function renderCorrelationChart(corrData) {
    const ctx = document.getElementById('correlationChart').getContext('2d');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Sort by absolute correlation magnitude
    const sortedEntries = Object.entries(corrData).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
    const labels = sortedEntries.map(e => e[0].replace('soil_', '').toUpperCase());
    const values = sortedEntries.map(e => e[1]);
    const colors = values.map(v => v >= 0 ? '#10b981' : '#ef4444');
    
    if (correlationChartInstance) correlationChartInstance.destroy();
    
    correlationChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pearson Correlation with Yield',
                data: values,
                backgroundColor: colors,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { 
                    beginAtZero: true, 
                    min: -1, 
                    max: 1,
                    grid: { color: isDark ? '#334155' : '#e2e8f0'},
                    ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                }
            }
        }
    });
}

// --- Admin Panel ---
async function loadAdminStats() {
    try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if(data.status === 'success') {
            document.getElementById('admin-total-preds').innerText = data.total_predictions;
            document.getElementById('admin-db-size').innerText = (data.database_size_bytes / 1024).toFixed(2) + ' KB';
        }
    } catch(e) {
        console.error("Failed to load admin stats", e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // ... existing init ...
    const retrainBtn = document.getElementById('btn-retrain-model');
    if (retrainBtn) {
        retrainBtn.addEventListener('click', async () => {
            try {
                retrainBtn.disabled = true;
                const res = await fetch('/api/admin/retrain', { method: 'POST' });
                const data = await res.json();
                const statusEl = document.getElementById('retrain-status');
                statusEl.innerText = data.message;
                statusEl.style.display = 'block';
                setTimeout(() => {
                    statusEl.style.display = 'none';
                    retrainBtn.disabled = false;
                }, 5000);
            } catch(e) {
                alert("Failed to trigger retraining.");
                retrainBtn.disabled = false;
            }
        });
    }
});

// --- Theme Settings ---
function initTheme() {
    const isDark = localStorage.getItem('agripredict_darkmode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').checked = true;
    }
}

function setupSettings() {
    const toggle = document.getElementById('dark-mode-toggle');
    toggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('agripredict_darkmode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('agripredict_darkmode', 'false');
        }
        // Redraw charts if needed for colors
    });

    document.getElementById('btn-clear-history').addEventListener('click', () => {
        if (confirm("Are you sure you want to delete all saved predictions?")) {
            predictionHistory = [];
            localStorage.setItem('agripredict_history', JSON.stringify([]));
            renderHistory();
            alert("History cleared!");
        }
    });
}

// --- Multilingual Support ---
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

// --- Geolocation ---
function setupGeolocation() {
    document.getElementById('btn-detect-location').addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        
        const locInput = document.getElementById('location');
        locInput.placeholder = "Detecting...";
        
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                // Reverse Geocoding using free Nominatim API
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const data = await res.json();
                locInput.value = data.address.city || data.address.town || data.address.state || "Detected Location";
                loadWeatherData(locInput.value);
            } catch (err) {
                console.error(err);
                locInput.value = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
            }
        }, () => {
            alert("Unable to retrieve your location");
            locInput.placeholder = "e.g., Pune, Maharashtra";
        });
    });
}

// --- Fetch Weather & Render Chart ---
async function loadWeatherData(location) {
    if(!location) return;
    try {
        const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
        const data = await response.json();
        document.getElementById('current-weather').innerText = `${data.current.temp}°C, ${data.current.condition}`;
        renderWeatherChart(data.forecast_7_days);
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

function renderWeatherChart(forecastData) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    const labels = forecastData.map(d => d.day);
    const temps = forecastData.map(d => d.temp);
    const isDark = document.body.classList.contains('dark-mode');

    if (weatherChartInstance) weatherChartInstance.destroy();

    weatherChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { 
                y: { 
                    beginAtZero: false, 
                    grid: { color: isDark ? '#334155' : '#e2e8f0'},
                    ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                },
                x: { 
                    grid: { color: isDark ? '#334155' : '#e2e8f0'},
                    ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                }
            }
        }
    });
}

function renderRadarChart(userInputs, cropType) {
    const ctx = document.getElementById('nutrientRadarChart').getContext('2d');
    const baseline = cropBaselines[cropType] || cropBaselines['wheat'];
    const isDark = document.body.classList.contains('dark-mode');
    
    if (radarChartInstance) radarChartInstance.destroy();
    
    radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Nitrogen', 'Phosphorus', 'Potassium', 'Moisture', 'pH (x10)'],
            datasets: [
                {
                    label: 'Your Soil',
                    data: [userInputs.soil_n, userInputs.soil_p, userInputs.soil_k, userInputs.soil_moisture, userInputs.soil_ph * 10],
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: '#10b981',
                    pointBackgroundColor: '#10b981'
                },
                {
                    label: 'Ideal Baseline',
                    data: [baseline.n, baseline.p, baseline.k, baseline.moisture, baseline.ph * 10],
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: '#6366f1',
                    pointBackgroundColor: '#6366f1'
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: isDark ? '#334155' : '#e2e8f0' },
                    grid: { color: isDark ? '#334155' : '#e2e8f0' },
                    pointLabels: { color: isDark ? '#94a3b8' : '#64748b' }
                }
            },
            plugins: { legend: { labels: { color: isDark ? '#f8fafc' : '#1e293b' } } }
        }
    });
}

// --- Handle Form Submission ---
function setupForm() {
    const form = document.getElementById('prediction-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Predicting...";
        submitBtn.disabled = true;

        const requestData = {
            crop_type: document.getElementById('crop_type').value,
            location: document.getElementById('location').value,
            sowing_date: document.getElementById('sowing_date').value || null,
            soil_n: parseFloat(document.getElementById('soil_n').value),
            soil_p: parseFloat(document.getElementById('soil_p').value),
            soil_k: parseFloat(document.getElementById('soil_k').value),
            soil_ph: parseFloat(document.getElementById('soil_ph').value),
            soil_moisture: parseFloat(document.getElementById('soil_moisture').value)
        };

        try {
            const predRes = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            const prediction = await predRes.json();
            
            // Reload weather for new location
            loadWeatherData(requestData.location);

            // Fetch Satellite data
            fetchSatelliteData(requestData.location);

            updateDashboard(prediction, requestData);
            saveToHistory(requestData, prediction);

        } catch (error) {
            console.error("Prediction failed:", error);
            alert("Failed to get prediction. Ensure backend is running.");
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });

    document.getElementById('btn-export-pdf').addEventListener('click', () => {
        const element = document.getElementById('export-content');
        const opt = {
            margin: 0.5,
            filename: `AgriPredict_Report_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    });
}

function updateDashboard(prediction, inputs) {
    document.getElementById('res-yield').innerText = prediction.yield_prediction;
    document.getElementById('res-unit').innerText = prediction.unit;
    document.getElementById('res-confidence').innerText = prediction.confidence_score;
    setTimeout(() => { document.getElementById('res-confidence-fill').style.width = `${prediction.confidence_score}%`; }, 100);
    
    const riskEl = document.getElementById('res-risk');
    if (riskEl) {
        riskEl.innerText = prediction.risk_level;
        if(prediction.risk_level === 'High') riskEl.style.color = '#ef4444';
        else if(prediction.risk_level === 'Medium') riskEl.style.color = '#f59e0b';
        else riskEl.style.color = '#10b981';
    }

    const detailedRiskContainer = document.getElementById('detailed-risk-container');
    if (detailedRiskContainer) {
        detailedRiskContainer.innerHTML = '';
        if (prediction.detailed_risks && prediction.detailed_risks.length > 0) {
            prediction.detailed_risks.forEach(risk => {
                const badge = document.createElement('div');
                let bgColor = 'var(--risk-low-bg)';
                let textColor = 'var(--risk-low)';
                if(risk.severity === 'High') { bgColor = 'var(--risk-high-bg)'; textColor = 'var(--risk-high)'; }
                if(risk.severity === 'Medium') { bgColor = 'var(--risk-medium-bg)'; textColor = 'var(--risk-medium)'; }
                
                badge.style.padding = '1rem';
                badge.style.borderRadius = '8px';
                badge.style.backgroundColor = bgColor;
                badge.style.border = `1px solid ${textColor}`;
                badge.style.marginBottom = '0.5rem';
                
                badge.innerHTML = `<strong style="color: ${textColor}; display: block; margin-bottom: 0.25rem;">${risk.type} (${risk.severity})</strong> <span class="text-sm" style="color: var(--text-main); font-weight: 500;">${risk.message}</span>`;
                detailedRiskContainer.appendChild(badge);
            });
        }
    }

    const recContainer = document.getElementById('res-recommendations');
    recContainer.innerHTML = '';
    prediction.recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.innerText = rec;
        recContainer.appendChild(li);
    });

    const insightsContainer = document.getElementById('res-insights');
    if (insightsContainer) {
        insightsContainer.innerHTML = '';
        if (prediction.explainability_insights && prediction.explainability_insights.length > 0) {
            prediction.explainability_insights.forEach(insight => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.flexDirection = 'column';
                li.style.alignItems = 'flex-start';
                li.style.padding = '1.25rem';
                li.style.borderRadius = 'var(--radius-md)';
                li.style.marginBottom = '1rem';
                li.style.border = '1px solid var(--border-color)';
                li.style.boxShadow = 'var(--shadow-sm)';
                
                // Parse the string: "Nitrogen (35.0) reduced expected yield by roughly 16.8%."
                const regex = /^([A-Za-z\s]+)\s*\(([\d.]+)\)\s*(increased|reduced)\sexpected\syield\sby\sroughly\s([\d.]+)%\.$/i;
                const match = insight.match(regex);
                
                if (match) {
                    const feature = match[1].trim();
                    const value = match[2];
                    const direction = match[3].toLowerCase();
                    const percent = match[4];
                    
                    const isPositive = direction === 'increased';
                    const colorVar = isPositive ? 'var(--primary)' : 'var(--risk-high)';
                    const bgVar = isPositive ? 'var(--risk-low-bg)' : 'var(--risk-high-bg)';
                    const icon = isPositive ? '↑' : '↓';
                    
                    li.style.backgroundColor = bgVar;
                    li.style.borderLeft = `4px solid ${colorVar}`;
                    
                    li.innerHTML = `
                        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-weight: 700; font-family: 'Outfit', sans-serif; font-size: 1.15rem; color: var(--text-main);">${feature}</span>
                            <span style="background-color: ${colorVar}; color: white; padding: 0.25rem 0.75rem; border-radius: 99px; font-weight: bold; font-size: 0.9rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${icon} ${percent}%</span>
                        </div>
                        <div style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.4;">
                            Input value of <strong style="color: var(--text-main); font-family: 'Outfit', sans-serif;">${value}</strong> <span style="opacity: 0.8;">&mdash; This factor significantly <strong>${direction}</strong> the model's overall predicted yield.</span>
                        </div>
                    `;
                } else {
                    li.style.backgroundColor = 'var(--primary-light)';
                    li.style.borderLeft = '4px solid var(--primary)';
                    li.innerHTML = `<span style="color: var(--text-main); font-weight: 500;">✨ ${insight}</span>`;
                }
                
                insightsContainer.appendChild(li);
            });
        } else {
            insightsContainer.innerHTML = '<li class="placeholder-text">No significant insights generated.</li>';
        }
    }
    
    const plotContainer = document.getElementById('res-insights-plot-container');
    const plotImg = document.getElementById('res-insights-plot');
    if (plotContainer && plotImg) {
        if (prediction.explainability_plot_url) {
            plotImg.src = prediction.explainability_plot_url + '?t=' + new Date().getTime(); // Prevent caching
            plotContainer.style.display = 'block';
        } else {
            plotContainer.style.display = 'none';
        }
    }
    
    if (prediction.harvest_prediction) {
        document.getElementById('res-harvest-date').innerText = prediction.harvest_prediction.estimated_harvest_date;
        document.getElementById('res-harvest-days').innerText = prediction.harvest_prediction.days_remaining;
        document.getElementById('res-harvest-status').innerText = prediction.harvest_prediction.status;
        
        let weatherImpactStr = "Weather conditions have ";
        const impact = prediction.harvest_prediction.weather_impact_days;
        if (impact < 0) weatherImpactStr += `accelerated maturation by ${Math.abs(impact)} days.`;
        else if (impact > 0) weatherImpactStr += `delayed maturation by ${impact} days.`;
        else weatherImpactStr += "not significantly altered the maturation timeline.";
        
        document.getElementById('res-harvest-weather').innerText = weatherImpactStr;
    }

    renderRadarChart(inputs, inputs.crop_type);
    document.getElementById('btn-export-pdf').style.display = 'inline-block';
}

// --- Satellite Data ---
async function fetchSatelliteData(location) {
    try {
        const res = await fetch(`/api/satellite?location=${encodeURIComponent(location)}`);
        const data = await res.json();
        
        const container = document.getElementById('satellite-container');
        if (container) {
            container.style.display = 'block';
            document.getElementById('res-satellite-ndvi').innerText = data.ndvi_index;
            document.getElementById('res-satellite-health').innerText = data.crop_health;
            
            const anomalyEl = document.getElementById('res-satellite-anomalies');
            anomalyEl.innerText = data.anomalies_detected;
            if (data.anomalies_detected !== "None") {
                anomalyEl.style.color = 'var(--risk-high)';
                anomalyEl.parentElement.style.backgroundColor = 'var(--risk-high-bg)';
                anomalyEl.parentElement.style.borderColor = 'var(--risk-high)';
            } else {
                anomalyEl.style.color = 'var(--primary)';
                anomalyEl.parentElement.style.backgroundColor = 'var(--risk-low-bg)';
                anomalyEl.parentElement.style.borderColor = 'var(--risk-low)';
            }
            
            // Initialize or update Leaflet map
            if (!window.satMap) {
                window.satMap = L.map('satellite-map').setView([data.lat, data.lon], 15);
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                }).addTo(window.satMap);
                
                // Add a cool overlay to simulate NDVI scanning area
                const bounds = [[data.lat - 0.005, data.lon - 0.005], [data.lat + 0.005, data.lon + 0.005]];
                window.ndviRect = L.rectangle(bounds, {color: "#10b981", weight: 2, fillOpacity: 0.2}).addTo(window.satMap);
            } else {
                window.satMap.setView([data.lat, data.lon], 15);
                const bounds = [[data.lat - 0.005, data.lon - 0.005], [data.lat + 0.005, data.lon + 0.005]];
                window.ndviRect.setBounds(bounds);
            }
            
            // Fix map sizing issue when div is initially hidden
            setTimeout(() => {
                window.satMap.invalidateSize();
            }, 100);
        }
    } catch (e) {
        console.error("Failed to fetch satellite data", e);
    }
}

// --- History ---
function saveToHistory(inputs, prediction) {
    const entry = {
        date: new Date().toLocaleString(),
        crop: inputs.crop_type,
        location: inputs.location,
        yield: prediction.yield_prediction,
        unit: prediction.unit
    };
    predictionHistory.unshift(entry); // Add to beginning
    if (predictionHistory.length > 20) predictionHistory.pop(); // Keep last 20
    localStorage.setItem('agripredict_history', JSON.stringify(predictionHistory));
}

function renderHistory() {
    const container = document.getElementById('history-container');
    if (predictionHistory.length === 0) {
        container.innerHTML = '<p class="text-muted">No past predictions found.</p>';
        return;
    }
    
    container.innerHTML = '';
    predictionHistory.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card history-card';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h4 style="text-transform: capitalize;">${item.crop}</h4>
                    <p class="text-muted text-sm">Location: ${item.location} - ${item.date}</p>
                </div>
                <div style="text-align:right;">
                    <strong style="font-size:1.5rem; color:var(--primary);">${item.yield}</strong>
                    <span class="text-muted text-sm">${item.unit}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    renderHistoryChart();
}

let historyChartInstance = null;

function renderHistoryChart() {
    const ctx = document.getElementById('historyChart').getContext('2d');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Reverse to show chronological order (oldest to newest left to right)
    const reversedHistory = [...predictionHistory].reverse();
    const labels = reversedHistory.map(item => item.date.split(',')[0]); // just the date part
    const dataPoints = reversedHistory.map(item => parseFloat(item.yield));
    
    if (historyChartInstance) historyChartInstance.destroy();
    
    historyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Predicted Yield Trend',
                data: dataPoints,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#6366f1'
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { 
                    beginAtZero: false, 
                    grid: { color: isDark ? '#334155' : '#e2e8f0'},
                    ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                },
                x: { 
                    grid: { color: isDark ? '#334155' : '#e2e8f0'},
                    ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                }
            }
        }
    });
}
