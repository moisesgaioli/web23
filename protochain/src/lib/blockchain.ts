import Block from "./block";
import Validation from './validation';
import BlockInfos from "./blockInfos";
import Transaction from "./transaction";
import TransactionType from "./transactionTypeEnum";
import TransactionSearch from "./transactionSearch";

/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    mempool: Transaction[];
    nextIndex : number = 0;
    static readonly DIFFICULTY_FACTOR = 5;
    static readonly MAX_DIFFICULTY = 62;
    static readonly TRANSACTION_PEER_BLOCK = 2;

    /**
     * Create Block Genesis
     */
    constructor() {
        this.mempool = [];
        this.blocks = [new Block({
            transactions : [new Transaction({
                data: "Genesis",
                type: TransactionType.FEE
            } as Transaction)] 
        } as Block)];
        this.nextIndex++;
    }

    getLastBlock() : Block {
        return this.blocks[this.blocks.length - 1]
    }

    getNextBlock() : BlockInfos | null {
        if (!this.mempool.length || !this.mempool)
            return null;
        
        const transactions = this.mempool.slice(0, Blockchain.TRANSACTION_PEER_BLOCK);
        const difficulty = this.getDifficulty();
        const previousHash = this.getLastBlock().hash;
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY;

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

    getDifficulty() : number {
        return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR);
    }

    getFeePerTx() : number {
        return 1;
    }

    getTransaction(hash: string) : TransactionSearch {
        let result = {} as TransactionSearch;

        this.mempool.forEach((transaction, index) => {
            if (transaction.hash === hash){
                result = {
                    mempoolIndex: index,
                    transaction: transaction
                } as TransactionSearch
            }
        });

        this.blocks.forEach((block, index) => {
            let transaction = block.transactions.find(t => t.hash === hash);

            if (transaction){
                result = {
                    blockIndex: index,
                    transaction: transaction
                } as TransactionSearch
            }
        });
        
        return result;
    }

    addBlock(block : Block ) : Validation {
        const lastBlock = this.getLastBlock();
        const validation = block.isValid(lastBlock.hash, lastBlock.index, this.getDifficulty());

        if(!validation.success) 
            return new Validation(false, `Invalid Block: ${validation.message}`);

        const transactionHashes = block.transactions.map(t => t.hash);
        const newMempool = this.mempool.filter(t => !transactionHashes.includes(t.hash));

        if(newMempool.length + transactionHashes.length !== this.mempool.length)
            return new Validation(false, `Invalid transaction in Block: mempool`);

        this.mempool = newMempool;

        this.blocks.push(block);
        this.nextIndex++;

        return new Validation(true, block.hash);
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
        for (let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index, this.getDifficulty());
            if (!validation.success) return new Validation(false, `Invalid Block #${currentBlock.index}: ${validation.message}`);
        }
        return new Validation();
    }
}
