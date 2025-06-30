import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Upload, 
  Link, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Clock,
  Database,
  Loader
} from 'lucide-react';
import { useBlockchainVerification } from '../hooks/useBlockchainVerification';
import { Database as DatabaseType } from '../types/database';
import toast from 'react-hot-toast';

type Persona = DatabaseType['public']['Tables']['personas']['Row'];

interface BlockchainVerificationButtonProps {
  persona: Persona;
  onVerificationComplete?: (result: any) => void;
  className?: string;
}

const BlockchainVerificationButton: React.FC<BlockchainVerificationButtonProps> = ({
  persona,
  onVerificationComplete,
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const {
    isVerifying,
    isUploading,
    isTransacting,
    progress,
    error,
    result,
    verifyPersonaOnBlockchain,
    checkVerificationStatus,
    hasDataChanged,
    resetState,
    isBlockchainConfigured
  } = useBlockchainVerification();

  const isVerified = checkVerificationStatus(persona);
  const dataChanged = hasDataChanged(persona);
  const canVerify = isBlockchainConfigured() && (!isVerified || dataChanged);

  const handleVerification = async () => {
    if (!canVerify) {
      if (!isBlockchainConfigured()) {
        toast.error('Blockchain verification not configured. Please add Web3.Storage and Algorand credentials.');
        return;
      }
      if (isVerified && !dataChanged) {
        toast.info('Memory data unchanged since last verification.');
        return;
      }
    }

    try {
      const verificationResult = await verifyPersonaOnBlockchain(persona);
      onVerificationComplete?.(verificationResult);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const getButtonText = () => {
    if (isVerifying) {
      if (isUploading) return 'Uploading to IPFS...';
      if (isTransacting) return 'Creating Blockchain Record...';
      return 'Verifying...';
    }
    
    if (isVerified && !dataChanged) return 'Verified on Blockchain';
    if (isVerified && dataChanged) return 'Re-verify Changes';
    return 'Verify on Blockchain';
  };

  const getButtonIcon = () => {
    if (isVerifying) return Loader;
    if (isVerified && !dataChanged) return CheckCircle;
    if (error) return AlertCircle;
    return Shield;
  };

  const ButtonIcon = getButtonIcon();

  if (!isBlockchainConfigured()) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`p-4 rounded-xl bg-obsidian-600/20 border border-obsidian-500/30 ${className}`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-obsidian-600/50 flex items-center justify-center">
            <Shield className="w-5 h-5 text-obsidian-400" />
          </div>
          <div>
            <h4 className="font-medium text-obsidian-300">Blockchain Verification</h4>
            <p className="text-sm text-obsidian-500">Configure Web3.Storage and Algorand to enable</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Verification Button */}
      <motion.button
        whileHover={{ scale: canVerify ? 1.02 : 1 }}
        whileTap={{ scale: canVerify ? 0.98 : 1 }}
        onClick={handleVerification}
        disabled={!canVerify || isVerifying}
        className={`w-full p-4 rounded-xl border transition-all duration-300 ${
          isVerified && !dataChanged
            ? 'bg-sage-500/20 border-sage-500/50 text-sage-300'
            : error
            ? 'bg-coral-500/20 border-coral-500/50 text-coral-300'
            : canVerify
            ? 'bg-aurora-500/20 border-aurora-500/50 text-aurora-300 hover:bg-aurora-500/30'
            : 'bg-obsidian-600/20 border-obsidian-500/30 text-obsidian-400 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isVerified && !dataChanged
              ? 'bg-sage-500/30'
              : error
              ? 'bg-coral-500/30'
              : 'bg-aurora-500/30'
          }`}>
            <ButtonIcon className={`w-5 h-5 ${
              isVerifying ? 'animate-spin' : ''
            }`} />
          </div>
          
          <div className="flex-1 text-left">
            <h4 className="font-medium">{getButtonText()}</h4>
            <p className="text-sm opacity-75">
              {isVerifying 
                ? `${progress}% complete`
                : isVerified && !dataChanged
                ? 'Memory data verified and immutable'
                : 'Create permanent blockchain record'
              }
            </p>
          </div>

          {(isVerified || result) && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Progress Bar */}
        {isVerifying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3"
          >
            <div className="w-full bg-obsidian-700 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-premium rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </motion.button>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-coral-500/20 border border-coral-500/50"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-coral-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-coral-300 font-medium text-sm">Verification Failed</p>
                <p className="text-coral-200 text-sm mt-1">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetState}
                  className="mt-2 px-3 py-1 bg-coral-500/30 hover:bg-coral-500/40 rounded-lg text-coral-200 text-sm font-medium transition-colors"
                >
                  Try Again
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Details */}
      <AnimatePresence>
        {showDetails && (result || isVerified) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <h5 className="font-medium text-white mb-3 flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Blockchain Verification Details</span>
            </h5>

            <div className="space-y-3 text-sm">
              {result?.ipfs && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-aurora-400" />
                    <span className="text-obsidian-300">IPFS Storage</span>
                  </div>
                  <motion.a
                    href={result.ipfs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-1 text-aurora-400 hover:text-aurora-300"
                  >
                    <span className="font-mono text-xs">
                      {result.ipfs.cid.slice(0, 8)}...{result.ipfs.cid.slice(-8)}
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                </div>
              )}

              {result?.algorand && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center space-x-2">
                    <Link className="w-4 h-4 text-lavender-400" />
                    <span className="text-obsidian-300">Algorand TX</span>
                  </div>
                  <motion.a
                    href={result.algorand.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-1 text-lavender-400 hover:text-lavender-300"
                  >
                    <span className="font-mono text-xs">
                      {result.algorand.txId.slice(0, 8)}...{result.algorand.txId.slice(-8)}
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                </div>
              )}

              {result?.timestamp && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-sage-400" />
                    <span className="text-obsidian-300">Verified</span>
                  </div>
                  <span className="text-sage-400 text-xs">
                    {new Date(result.timestamp).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 p-2 rounded-lg bg-sage-500/10 border border-sage-500/20">
              <p className="text-sage-300 text-xs">
                ✅ This memory has been permanently recorded on the blockchain and IPFS, 
                ensuring its authenticity and immutability for future generations.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlockchainVerificationButton;