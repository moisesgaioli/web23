import sha256 from 'crypto-js/sha256';

export default class Block {
    index : number;
    timestamp: number;
    hash: string;
    previousHash: string;
    data : string;

    /**
     * Creates a new Block
     * @param index The block index in blockchain
     * @param previousHash The previous block hash
     * @param data The block data
     */
    constructor(index: number, previousHash: string, data: string) {
        this.index = index;
        this.timestamp = Date.now();
        this.previousHash = previousHash;
        this.data = data;
        this.hash = this.getHash();
    }

    getHash() : string {
        return sha256(this.index + this.data + this.timestamp + this.previousHash).toString();
    }

    isValid(previousHash : string, previousIndex : number) : boolean {
        if (this.index !== previousIndex + 1) return false;
        if (this.previousHash !== previousHash) return false;
        if (this.timestamp < 1) return false;
        if (!this.data) return false;
        if (this.hash !== this.getHash()) return false;
        return true;
    }
}