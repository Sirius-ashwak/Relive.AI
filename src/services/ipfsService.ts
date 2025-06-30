import { Web3Storage } from 'web3.storage';
import { BLOCKCHAIN_CONFIG } from '../config/blockchain';

export interface IPFSUploadResult {
  cid: string;
  url: string;
  size: number;
}

export class IPFSService {
  private client: Web3Storage | null = null;

  constructor() {
    if (BLOCKCHAIN_CONFIG.WEB3_STORAGE_TOKEN) {
      this.client = new Web3Storage({ 
        token: BLOCKCHAIN_CONFIG.WEB3_STORAGE_TOKEN 
      });
    }
  }

  async uploadPersonaData(personaData: any): Promise<IPFSUploadResult> {
    if (!this.client) {
      throw new Error('Web3.Storage not configured. Please add VITE_WEB3_STORAGE_TOKEN to your environment variables.');
    }

    try {
      console.log('📦 Uploading persona data to IPFS...');
      
      // Prepare the data for upload
      const dataToUpload = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        type: 'relive-persona-memory',
        data: {
          id: personaData.id,
          name: personaData.name,
          type: personaData.type,
          description: personaData.description,
          personality: personaData.personality,
          memoryData: personaData.memory_data,
          createdAt: personaData.created_at,
          verificationHash: this.generateVerificationHash(personaData)
        }
      };

      // Convert to JSON and create a File
      const jsonString = JSON.stringify(dataToUpload, null, 2);
      const file = new File(
        [jsonString], 
        `relive-persona-${personaData.id}-${Date.now()}.json`,
        { type: 'application/json' }
      );

      // Upload to IPFS
      const cid = await this.client.put([file], {
        name: `Relive Persona Memory - ${personaData.name}`,
        maxRetries: 3
      });

      const result: IPFSUploadResult = {
        cid: cid,
        url: `https://${cid}.ipfs.w3s.link/${file.name}`,
        size: jsonString.length
      };

      console.log('✅ IPFS upload successful:', result);
      return result;

    } catch (error) {
      console.error('❌ IPFS upload failed:', error);
      throw new Error(`Failed to upload to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async retrievePersonaData(cid: string): Promise<any> {
    if (!this.client) {
      throw new Error('Web3.Storage not configured');
    }

    try {
      console.log('📥 Retrieving persona data from IPFS:', cid);
      
      const res = await this.client.get(cid);
      if (!res || !res.ok) {
        throw new Error('Failed to retrieve data from IPFS');
      }

      const files = await res.files();
      if (files.length === 0) {
        throw new Error('No files found in IPFS response');
      }

      const file = files[0];
      const content = await file.text();
      const data = JSON.parse(content);

      console.log('✅ IPFS retrieval successful');
      return data;

    } catch (error) {
      console.error('❌ IPFS retrieval failed:', error);
      throw new Error(`Failed to retrieve from IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateVerificationHash(personaData: any): string {
    // Create a simple hash for verification purposes
    const dataString = JSON.stringify({
      id: personaData.id,
      name: personaData.name,
      type: personaData.type,
      memoryData: personaData.memory_data
    });
    
    // Simple hash function (in production, use a proper cryptographic hash)
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  isConfigured(): boolean {
    return !!this.client;
  }
}

export const ipfsService = new IPFSService();