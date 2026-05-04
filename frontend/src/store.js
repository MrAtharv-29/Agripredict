import { create } from 'zustand';

export const useStore = create((set) => ({
  // Form State
  formData: {
    crop_type: 'wheat',
    location: 'Central',
    soil_n: 90,
    soil_p: 45,
    soil_k: 40,
    soil_ph: 6.8,
    soil_moisture: 65,
    temperature: 25,
    rainfall: 150,
    sunlight: 9,
    ndvi: 0.7,
    prev_yield: 5.0,
    area: 5.0,
    soil_type: 'black',
    irrigation: 'Tubewell'
  },
  
  updateFormData: (newData) => set((state) => ({
    formData: { ...state.formData, ...newData }
  })),

  // Prediction State
  predictionResult: null,
  isPredicting: false,
  predictionError: null,

  setPredictionResult: (result) => set({ predictionResult: result, isPredicting: false, predictionError: null }),
  setIsPredicting: (isPredicting) => set({ isPredicting, predictionError: null }),
  setPredictionError: (error) => set({ predictionError: error, isPredicting: false }),

  // UI State
  activeTab: 'Dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  language: 'en',
  setLanguage: (lang) => set({ language: lang })
}));
