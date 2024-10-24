import { describe, expect, jest, test } from '@jest/globals';
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';

jest.mock('../src/lib/block');

describe("Blockchain tests", () => {

    test('Should has genesis block', () => {
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toEqual(1);
        expect(blockchain.isValid().success).toBeTruthy();
    })

    test('Should be valid - Genesis', () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should be valid - Two blocks', () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            data: "AA"
        } as Block));
        expect(result.success).toEqual(true);
    })

    test('Should be add Block', () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            data: "AA"
        } as Block));
        expect(result.success).toEqual(true);
    })

    test('Should not add Block', () => {
        const blockchain = new Blockchain();
        const block = new Block({
            index: -1, 
            previousHash: blockchain.blocks[0].hash, 
            data: "AA"
        } as Block);
        const result = blockchain.addBlock(block);
        expect(result.success).toEqual(false);
    })

    test('Should not be valid', () => {
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            data: "AA"
        } as Block));

        blockchain.blocks[1].index = -1;

        expect(blockchain.isValid().success).toEqual(false);
    })

    test('Should get Block', () => {
        const blockchain = new Blockchain();
        const block = blockchain.getBlock(blockchain.blocks[0].hash);
        expect(block).toBeTruthy();
    })

    test('Should get next Block infos', () => {
        const blockchain = new Blockchain();
        const infos = blockchain.getNextBlock();
        expect(infos.index).toEqual(1);
        expect(infos.previousHash).toEqual(blockchain.blocks[0].hash);
        expect(infos.difficulty).toEqual(1);
        expect(infos.maxDifficulty).toEqual(62);
        expect(infos.feePerTx).toEqual(1);
        expect(infos.data).toEqual(new Date().toString());
    })
})
