import { beforeAll, describe, expect, test } from '@jest/globals';
import Block from '../src/lib/block';

describe("Block tests", () => {

    let blockGenesis : Block;

    beforeAll(() => {
        blockGenesis = new Block(0, "" , "Genesis");
    })

    test('Should be valid', () => {
        const block = new Block(1, blockGenesis.hash, "a");
        const valid = block.isValid(blockGenesis.hash, blockGenesis.index);
        expect(valid).toEqual(true);
    })

    test('Should not be valid - PreviousHash', () => {
        const block = new Block(1, "", "A");
        const valid = block.isValid(blockGenesis.hash, blockGenesis.index);
        expect(valid).toBeFalsy();
    })

    test('Should not be valid - Index', () => {
        const block = new Block(-1, blockGenesis.hash, "a");
        const valid = block.isValid(blockGenesis.hash, blockGenesis.index);
        expect(valid).toBeFalsy();
    })

    test('Should not be valid - Data', () => {
        const block = new Block(1, blockGenesis.hash, "");
        const valid = block.isValid(blockGenesis.hash, blockGenesis.index);
        expect(valid).toBeFalsy();
    })

    test('Should not be valid - Timestamp', () => {
        let block = new Block(1, blockGenesis.hash, "A");
        block.timestamp = -1;
        const valid = block.isValid(blockGenesis.hash, blockGenesis.index);
        expect(valid).toBeFalsy();
    })

    test('Should not be valid - Hash', () => {
        let block = new Block(1, blockGenesis.hash, "A");
        block.hash = "";
        const valid = block.isValid(blockGenesis.hash, blockGenesis.index);
        expect(valid).toBeFalsy();
    })
})