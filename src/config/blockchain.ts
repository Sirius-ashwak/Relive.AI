export const BLOCKCHAIN_CONFIG = {
  // Web3.Storage
  WEB3_STORAGE_TOKEN: import.meta.env.VITE_WEB3_STORAGE_TOKEN || '',
  
  // Algorand
  ALGO_ADDRESS: import.meta.env.VITE_ALGO_ADDRESS || '',
  ALGO_SECRET: import.meta.env.VITE_ALGO_SECRET || '',
  ALGO_SERVER: 'https://testnet-api.algonode.cloud',
  ALGO_PORT: 443,
  ALGO_TOKEN: '',
  ALGO_NETWORK: 'testnet',
  
  // Explorer URLs
  ALGO_EXPLORER_BASE: 'https://testnet.algoexplorer.io',
};

// Validate blockchain configuration
export const validateBlockchainConfig = () => {
  const requiredKeys = {
    WEB3_STORAGE_TOKEN: BLOCKCHAIN_CONFIG.WEB3_STORAGE_TOKEN,
    ALGO_ADDRESS: BLOCKCHAIN_CONFIG.ALGO_ADDRESS,
    ALGO_SECRET: BLOCKCHAIN_CONFIG.ALGO_SECRET
  };

  const missingKeys = Object.entries(requiredKeys)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.warn('⚠️ Missing blockchain configuration keys:', missingKeys);
    console.warn('Please add them to your .env file:');
    missingKeys.forEach(key => {
      console.warn(`VITE_${key}=your_${key.toLowerCase()}_here`);
    });
  }

  return missingKeys.length === 0;
};

// Check blockchain services status
export const getBlockchainStatus = () => {
  return {
    web3Storage: !!BLOCKCHAIN_CONFIG.WEB3_STORAGE_TOKEN,
    algorand: !!(BLOCKCHAIN_CONFIG.ALGO_ADDRESS && BLOCKCHAIN_CONFIG.ALGO_SECRET),
    configured: validateBlockchainConfig()
  };
};