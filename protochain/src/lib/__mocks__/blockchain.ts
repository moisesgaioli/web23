import Block from "./block";
import Validation from '../validation';

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

    getBlock(hash: string) : Block | undefined {
        return this.blocks.find(b => b.hash === hash);
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
