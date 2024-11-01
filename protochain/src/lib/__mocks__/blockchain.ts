import Block from "./block";
import Validation from '../validation';
import BlockInfos from "../blockInfos";
import Transaction from './transaction';
import TransactionType from "../transactionTypeEnum";
import TransactionSearch from "../transactionSearch";

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    mempool: Transaction[];
    nextIndex : number = 0;
    static readonly DIFFICULTY_FACTOR = 5;
    static readonly MAX_DIFFICULTY = 62;
    static readonly TRANSACTION_PEER_BLOCK = 2;

    /**
     * Creates a new mocked Blockchain
     */
    constructor() {
        this.mempool = [];
        this.blocks = [new Block({
            index: 0,
            hash: "HASH",
            previousHash: "",
            transactions :[new Transaction({
                data: "Transaction",
                type: TransactionType.FEE
            } as Transaction)] ,
            timestamp: Date.now()
        } as Block) ];
        this.nextIndex++;
    }

    getLastBlock() : Block {
        return this.blocks[this.blocks.length - 1]
    }

    getNextBlock() : BlockInfos | null {
        const transactions = this.mempool.slice(0, Blockchain.TRANSACTION_PEER_BLOCK);
        const difficulty = 1;
        const previousHash = this.getLastBlock().hash;
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = 62;

        return {
            transactions,
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfos;
    }

    getBlock(hash: string) : Block | undefined {
        return this.blocks.find(b => b.hash === hash);
    }

    getFeePerTx() : number {
        return 1;
    }

    getTransaction(hash: string) : TransactionSearch {
        return {
            mempoolIndex: 0,
            transaction: new Transaction()
        } as TransactionSearch
    }

    addBlock(block : Block ) : Validation {
        if (block.index < 0) return new Validation(false, "Invalid mock block");
        
        this.blocks.push(block);
        this.nextIndex++;

        return new Validation();
    }
    
    addTransaction(transaction: Transaction): Validation {
        const validation = transaction.isValid();
        
        if (!validation.success)
            return new Validation(false, "Invalid transaction: " + validation.message)
        
        if (this.blocks.some(b => b.transactions.some(t => t.hash === transaction.hash)))
            return new Validation(false, "Invalid transaction: already exists")
        
        if (this.mempool.some(b => b.hash === transaction.hash))
            return new Validation(false, "Invalid transaction: already exists in mempool")
        
        this.mempool.push(transaction);
        
        return new Validation(true, transaction.hash);
    }

    isValid() : Validation {
        return new Validation();
    }
}
