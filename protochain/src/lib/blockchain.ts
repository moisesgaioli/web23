import Block from "./block";
import Validation from './validation';
import BlockInfos from "./blockInfos";

/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    nextIndex : number = 0;
    static readonly DIFFICULTY_FACTOR = 5;
    static readonly MAX_DIFFICULTY = 62;

    /**
     * Create Block Genesis
     */
    constructor() {
        this.blocks = [new Block({
            data : "Genesis"
        } as Block) ];
        this.nextIndex++;
    }

    getLastBlock() : Block {
        return this.blocks[this.blocks.length - 1]
    }

    getNextBlock() : BlockInfos {
        const data = new Date().toString();
        const difficulty = this.getDifficulty();
        const previousHash = this.getLastBlock().hash;
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY;

        return {
            data,
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

    addBlock(block : Block ) : Validation {
        const lastBlock = this.getLastBlock();
        const validation = block.isValid(lastBlock.hash, lastBlock.index, this.getDifficulty());

        if(!validation.success) 
            return new Validation(false, `Invalid Block: ${validation.message}`);

        this.blocks.push(block);
        this.nextIndex++;

        return new Validation();
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
