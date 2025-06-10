export const API_CONFIG = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBbTzJ0pm1b40Mfk_dt2Vg9U9tCsgORUog',
  REVENUECAT_SECRET: 'sk_eidUkGjkbYZkRskDbaMyAGIaMfftN',
  PICA_API_KEY: 'sk_test_1_VK4-4n7BE70pW3nQw-WfK_lRYDOeazT85tVm8zM61K4-1imOxEXS-mDHPbvQuaPmPo-jRpVq8fHFuJyKbm5bjx22Yip-etJ4eVknbzIuHs4tjdFC9HmHJzgkjr6MBki3FsRtdMeCokWqlxoIRsUgGoxtd0TTy9tSd8ab_Hc547s0QsLJbSmF7I5TBRJYv1PAx0dy2Bf4O_ffldzOMGzPlWWWViggvkJgM-eMcK1PpQ',
  EXPO_ACCESS_TOKEN: 'DH7VdsJddjaTO8hfxqiC3MR-nvA_1ZHlmhk31vpV',
  TAVUS_API_KEY: '646e75eaca184515bc432e18a799ef1a',
  ELEVENLABS_API_KEY: 'sk_71dad72ce5375e9aa0221bf2c9b5c28e55c256b0c98a1c55'
};

export const API_ENDPOINTS = {
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  TAVUS: 'https://tavusapi.com/v2',
  ELEVENLABS: 'https://api.elevenlabs.io/v1',
  REVENUECAT: 'https://api.revenuecat.com/v1'
};