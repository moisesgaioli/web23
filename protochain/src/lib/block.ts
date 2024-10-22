import sha256 from 'crypto-js/sha256';
import Validation from './validation';

export default class Block {
    index : number;
    timestamp: number;
    hash: string;
    previousHash: string;
    data : string;

    /**
     * Creates a new Block
     * @param block The Block infos 
     */
    constructor(block? : Block) {
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || "";
        this.data = block?.data || "";
        this.hash = block?.hash || this.getHash();
    }

    getHash() : string {
        return sha256(`${this.index}${this.data}${this.timestamp}${this.previousHash}`).toString();
    }
    
    /**
     * Validates the Block
     * @param previousHash Hash of previous block
     * @param previousIndex Index of previous block
     * @returns Returns if the block is valid
     */
    isValid(previousHash : string, previousIndex : number) : Validation {
        if (this.index !== previousIndex + 1) return new Validation(false, "Invalid index");
        if (this.hash !== this.getHash()) return new Validation(false, "Invalid hash");
        if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");
        if (!this.data) return new Validation(false, "Invalid data");
        if (this.previousHash !== previousHash) return new Validation(false, "Invalid previous hash");
        return new Validation();
    }
}