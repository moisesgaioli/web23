import sha256 from 'crypto-js/sha256';
import Validation from './validation';
import BlockInfos from './blockInfos';
import Transaction from './transaction';
import TransactionType from './transactionTypeEnum';

/**
 * Block class
 */
export default class Block {
    index : number;
    timestamp: number;
    hash: string;
    previousHash: string;
    transactions : Transaction[];
    nonce : number;
    minerWallet : string;

    /**
     * Creates a new Block
     * @param block The Block infos 
     */
    constructor(block? : Block) {
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || "";

        this.transactions = block?.transactions 
            ? block.transactions.map(tx => new Transaction(tx))
            : [] as Transaction[]; 

        this.nonce = block?.nonce || 0;
        this.minerWallet = block?.minerWallet || "";
        this.hash = block?.hash || this.getHash();
    }

    getHash() : string {
        const txs = this.transactions && this.transactions.length > 0 
            ? this.transactions.map(tx => tx.hash).reduce((a, b) => a + b)
            : "";

        return sha256(this.index + txs + this.timestamp + this.previousHash + this.nonce + this.minerWallet).toString();
    }

    /**
     * Generates a new valid hash for this block with the specified difficulty
     * @param difficulty The blockchain current difficulty
     * @param minerWallet The miner wallet address
     */
    mine(difficulty: number, minerWallet: string) {
        this.minerWallet = minerWallet;
        const prefix = new Array(difficulty + 1).join("0");

        do {
            this.nonce++;
            this.hash = this.getHash();
        }
        while (!this.hash.startsWith(prefix));
    }
    
    /**
     * Validates the Block
     * @param previousHash Hash of previous block
     * @param previousIndex Index of previous block
     * @param difficulty The blockchain current difficulty
     * @returns Returns if the block is valid
     */
    isValid(previousHash : string, previousIndex : number, difficulty: number) : Validation {
        if (this.transactions && this.transactions.length > 0 ) {
            if (this.transactions.filter(tx => tx.type == TransactionType.FEE).length > 1)
                return new Validation(false, "Two many fees");

            if (this.transactions.filter(tx => !tx.isValid().success).length > 0)
                return new Validation(false, "Invalid Block due to invalid transaction");
        } 

        if (this.index !== previousIndex + 1) return new Validation(false, "Invalid index");
        if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");
        if (this.previousHash !== previousHash) return new Validation(false, "Invalid previous hash");
        if (!this.nonce || !this.minerWallet) return new Validation(false, "No mined");

        const prefix = new Array(difficulty + 1).join("0");
        if (this.hash !== this.getHash() || !this.hash.startsWith(prefix)) return new Validation(false, "Invalid hash");

        return new Validation();
    }

    static fromBlockInfos(blockInfo : BlockInfos) : Block {
        return new Block({
            index: blockInfo.index,
            previousHash: blockInfo.previousHash,
            transactions: blockInfo.transactions
        } as Block);
    }
}