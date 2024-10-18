import { describe, expect, test } from '@jest/globals';
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';

describe("Blockchain tests", () => {

    test('Should has genesis block', () => {
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toEqual(1);
    })

    test('Should be valid - Genesis', () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValid()).toEqual(true);
    })

    test('Should be valid - Two blocks', () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "AA"));
        expect(blockchain.isValid()).toEqual(true);
    })

    test('Should be add Block', () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "AA"));
        expect(result).toEqual(true);
    })

    test('Should not add Block', () => {
        const blockchain = new Blockchain();
        const block = new Block(-1, blockchain.blocks[0].hash, "AA");
        const result = blockchain.addBlock(block);
        expect(result).toEqual(false);
    })

    test('Should not be valid', () => {
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "AA"));
        blockchain.blocks[1].data = "BB"; 
        expect(blockchain.isValid()).toEqual(false);
    })
})