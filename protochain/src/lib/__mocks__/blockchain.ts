import Block from "./block";
import Validation from '../validation';
import BlockInfos from "../blockInfos";

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    nextIndex : number = 0;

    /**
     * Creates a new mocked Blockchain
     */
    constructor() {
        this.blocks = [new Block({
            index: 0,
            hash: "HASH",
            previousHash: "",
            data: "Genesis",
            timestamp: Date.now()
        } as Block) ];
        this.nextIndex++;
    }

    getLastBlock() : Block {
        return this.blocks[this.blocks.length - 1]
    }

    getNextBlock() : BlockInfos {
        const data = new Date().toString();
        const difficulty = 1;
        const previousHash = this.getLastBlock().hash;
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = 62;

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

    getFeePerTx() : number {
        return 1;
    }

    addBlock(block : Block ) : Validation {
        if (block.index < 0) return new Validation(false, "Invalid mock block");
        
        this.blocks.push(block);
        this.nextIndex++;

        return new Validation();
    }

    isValid() : Validation {
        return new Validation();
    }
}
