import { useState } from 'react';
import { ipfsService, IPFSUploadResult } from '../services/ipfsService';
import { algorandService, AlgorandTransactionResult } from '../services/algorandService';
import { Database } from '../types/database';
import toast from 'react-hot-toast';

type Persona = Database['public']['Tables']['personas']['Row'];

export interface BlockchainVerificationResult {
  ipfs: IPFSUploadResult;
  algorand: AlgorandTransactionResult;
  timestamp: string;
}

export interface VerificationState {
  isVerifying: boolean;
  isUploading: boolean;
  isTransacting: boolean;
  progress: number;
  error: string | null;
  result: BlockchainVerificationResult | null;
}

export const useBlockchainVerification = () => {
  const [state, setState] = useState<VerificationState>({
    isVerifying: false,
    isUploading: false,
    isTransacting: false,
    progress: 0,
    error: null,
    result: null
  });

  const verifyPersonaOnBlockchain = async (persona: Persona): Promise<BlockchainVerificationResult> => {
    setState(prev => ({
      ...prev,
      isVerifying: true,
      isUploading: false,
      isTransacting: false,
      progress: 0,
      error: null,
      result: null
    }));

    try {
      // Step 1: Upload to IPFS
      setState(prev => ({ ...prev, isUploading: true, progress: 10 }));
      toast.loading('Uploading memory data to IPFS...', { id: 'blockchain-verification' });

      const ipfsResult = await ipfsService.uploadPersonaData(persona);
      
      setState(prev => ({ ...prev, isUploading: false, progress: 50 }));
      toast.loading('Creating blockchain verification...', { id: 'blockchain-verification' });

      // Step 2: Create Algorand transaction
      setState(prev => ({ ...prev, isTransacting: true, progress: 60 }));

      const algorandResult = await algorandService.createMemoryVerificationTransaction(
        ipfsResult.cid,
        persona.name
      );

      setState(prev => ({ ...prev, isTransacting: false, progress: 100 }));

      const result: BlockchainVerificationResult = {
        ipfs: ipfsResult,
        algorand: algorandResult,
        timestamp: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        isVerifying: false,
        result,
        error: null
      }));

      toast.success('Memory verified on blockchain!', { id: 'blockchain-verification' });
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({
        ...prev,
        isVerifying: false,
        isUploading: false,
        isTransacting: false,
        error: errorMessage
      }));

      toast.error(`Verification failed: ${errorMessage}`, { id: 'blockchain-verification' });
      throw error;
    }
  };

  const checkVerificationStatus = (persona: Persona): boolean => {
    // Check if persona has been verified (you might store this in the database)
    // For now, we'll check if it has blockchain-related metadata
    return !!(persona.memory_data as any)?.blockchainVerification;
  };

  const hasDataChanged = (persona: Persona, lastVerification?: BlockchainVerificationResult): boolean => {
    if (!lastVerification) return true;
    
    // Simple check - in production, you might want a more sophisticated comparison
    const currentHash = JSON.stringify(persona.memory_data);
    const lastHash = (persona.memory_data as any)?.lastVerificationHash;
    
    return currentHash !== lastHash;
  };

  const resetState = () => {
    setState({
      isVerifying: false,
      isUploading: false,
      isTransacting: false,
      progress: 0,
      error: null,
      result: null
    });
  };

  const isBlockchainConfigured = (): boolean => {
    return ipfsService.isConfigured() && algorandService.isConfigured();
  };

  return {
    ...state,
    verifyPersonaOnBlockchain,
    checkVerificationStatus,
    hasDataChanged,
    resetState,
    isBlockchainConfigured
  };
};