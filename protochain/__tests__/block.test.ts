import { beforeAll, describe, expect, test } from '@jest/globals';
import Block from '../src/lib/block';

describe("Block tests", () => {

    let genesisBlock : Block;
    const difficulty = 0;
    const minerWallet = "MINER";

    beforeAll(() => {
        genesisBlock = new Block({
            data: "Genesis"
        } as Block);
    })

    test('Should be valid', () => {
        const block = new Block({
            index: 1, 
            previousHash: genesisBlock.hash, 
            data: "A"
        } as Block);
        block.mine(difficulty, minerWallet);
        console.log(block);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toEqual(true);
    })

    test('Should not be valid - Fallbacks', () => {
        const block = new Block();
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toEqual(false);
        expect(valid.message).toEqual("Invalid index");
    })

    test('Should not be valid - Hash', () => {
        let block = new Block({
            index: 1, 
            previousHash: genesisBlock.hash, 
            data: "A"
        } as Block);
        block.mine(difficulty, minerWallet);
        block.hash = "";
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("Invalid hash");
    })

    test('Should not be valid - Index', () => {
        const block = new Block({
            index: -1, 
            previousHash: genesisBlock.hash, 
            data: "A"
        } as Block);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("Invalid index");
    })

    test('Should not be valid - Data', () => {
        const block = new Block({
            index: 1, 
            previousHash: genesisBlock.hash, 
            data: ""
        } as Block);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("Invalid data");
    })

    test('Should not be valid - Timestamp', () => {
        let block = new Block({
            index: 1, 
            previousHash: genesisBlock.hash, 
            data: "A"
        } as Block);
        block.timestamp = -1;
        block.hash = block.getHash();
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("Invalid timestamp");
    })

    test('Should not be valid - PreviousHash', () => {
        const block = new Block({
            index: 1, 
            hash: "", 
            data: "A"
        } as Block);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("Invalid previous hash");
    })

    test('Should not be valid - No mined', () => {
        let block = new Block({
            index: 1, 
            previousHash: genesisBlock.hash, 
            hash: "",
            data: "A"
        } as Block);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("No mined");
    })
})