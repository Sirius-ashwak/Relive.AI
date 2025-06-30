import algosdk from 'algosdk';
import { BLOCKCHAIN_CONFIG } from '../config/blockchain';

export interface AlgorandTransactionResult {
  txId: string;
  explorerUrl: string;
  confirmedRound?: number;
}

export class AlgorandService {
  private algodClient: algosdk.Algodv2 | null = null;
  private account: algosdk.Account | null = null;

  constructor() {
    if (this.isConfigured()) {
      this.initializeClient();
    }
  }

  private initializeClient() {
    try {
      // Initialize Algorand client
      this.algodClient = new algosdk.Algodv2(
        BLOCKCHAIN_CONFIG.ALGO_TOKEN,
        BLOCKCHAIN_CONFIG.ALGO_SERVER,
        BLOCKCHAIN_CONFIG.ALGO_PORT
      );

      // Initialize account from secret key
      if (BLOCKCHAIN_CONFIG.ALGO_SECRET) {
        const secretKey = algosdk.mnemonicToSecretKey(BLOCKCHAIN_CONFIG.ALGO_SECRET);
        this.account = {
          addr: secretKey.addr,
          sk: secretKey.sk
        };

        // Verify the address matches
        if (BLOCKCHAIN_CONFIG.ALGO_ADDRESS && this.account.addr !== BLOCKCHAIN_CONFIG.ALGO_ADDRESS) {
          console.warn('⚠️ Algorand address mismatch. Using address from secret key.');
        }
      }

      console.log('✅ Algorand client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Algorand client:', error);
      this.algodClient = null;
      this.account = null;
    }
  }

  async createMemoryVerificationTransaction(ipfsCid: string, personaName: string): Promise<AlgorandTransactionResult> {
    if (!this.algodClient || !this.account) {
      throw new Error('Algorand not configured. Please add VITE_ALGO_ADDRESS and VITE_ALGO_SECRET to your environment variables.');
    }

    try {
      console.log('🔗 Creating Algorand verification transaction...');

      // Get suggested transaction parameters
      const suggestedParams = await this.algodClient.getTransactionParams().do();

      // Create the note with IPFS CID
      const note = new TextEncoder().encode(`Relive Memory Verification - ${personaName} - CID: ${ipfsCid}`);

      // Create a no-op transaction (sending 0 ALGOs to self)
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: this.account.addr,
        to: this.account.addr,
        amount: 0, // No-op transaction
        note: note,
        suggestedParams: suggestedParams
      });

      // Sign the transaction
      const signedTxn = txn.signTxn(this.account.sk);

      // Submit the transaction
      console.log('📤 Submitting transaction to Algorand...');
      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
      console.log('⏳ Waiting for transaction confirmation...');
      const confirmedTxn = await algosdk.waitForConfirmation(this.algodClient, txId, 4);

      const result: AlgorandTransactionResult = {
        txId: txId,
        explorerUrl: `${BLOCKCHAIN_CONFIG.ALGO_EXPLORER_BASE}/tx/${txId}`,
        confirmedRound: confirmedTxn['confirmed-round']
      };

      console.log('✅ Algorand transaction confirmed:', result);
      return result;

    } catch (error) {
      console.error('❌ Algorand transaction failed:', error);
      throw new Error(`Failed to create Algorand transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTransactionInfo(txId: string): Promise<any> {
    if (!this.algodClient) {
      throw new Error('Algorand client not initialized');
    }

    try {
      const txInfo = await this.algodClient.pendingTransactionInformation(txId).do();
      return txInfo;
    } catch (error) {
      console.error('❌ Failed to get transaction info:', error);
      throw error;
    }
  }

  async getAccountBalance(): Promise<number> {
    if (!this.algodClient || !this.account) {
      throw new Error('Algorand not configured');
    }

    try {
      const accountInfo = await this.algodClient.accountInformation(this.account.addr).do();
      return accountInfo.amount / 1000000; // Convert microAlgos to Algos
    } catch (error) {
      console.error('❌ Failed to get account balance:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!(BLOCKCHAIN_CONFIG.ALGO_ADDRESS && BLOCKCHAIN_CONFIG.ALGO_SECRET);
  }

  getAccountAddress(): string | null {
    return this.account?.addr || null;
  }
}

export const algorandService = new AlgorandService();