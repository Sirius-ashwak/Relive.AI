export const API_CONFIG = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  REVENUECAT_SECRET: import.meta.env.VITE_REVENUECAT_SECRET || '',
  PICA_API_KEY: import.meta.env.VITE_PICA_API_KEY || '',
  EXPO_ACCESS_TOKEN: import.meta.env.VITE_EXPO_ACCESS_TOKEN || '',
  TAVUS_API_KEY: import.meta.env.VITE_TAVUS_API_KEY || '',
  ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY || ''
};

export const API_ENDPOINTS = {
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  TAVUS: 'https://tavusapi.com/v2',
  ELEVENLABS: 'https://api.elevenlabs.io/v1',
  REVENUECAT: 'https://api.revenuecat.com/v1'
};

// Validate required API keys
export const validateApiKeys = () => {
  const requiredKeys = {
    GEMINI_API_KEY: API_CONFIG.GEMINI_API_KEY
  };

  const missingKeys = Object.entries(requiredKeys)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.warn('⚠️ Missing required API keys:', missingKeys);
    console.warn('Please add them to your .env file:');
    missingKeys.forEach(key => {
      console.warn(`VITE_${key}=your_${key.toLowerCase()}_here`);
    });
  }

  return missingKeys.length === 0;
};

// Check API key status
export const getApiKeyStatus = () => {
  return {
    gemini: !!API_CONFIG.GEMINI_API_KEY,
    elevenlabs: !!API_CONFIG.ELEVENLABS_API_KEY,
    tavus: !!API_CONFIG.TAVUS_API_KEY,
    revenuecat: !!API_CONFIG.REVENUECAT_SECRET,
    pica: !!API_CONFIG.PICA_API_KEY,
    expo: !!API_CONFIG.EXPO_ACCESS_TOKEN
  };
};