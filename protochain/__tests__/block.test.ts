import { beforeAll, describe, expect, test, jest } from '@jest/globals';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionTypeEnum';
import BlockInfos from '../src/lib/blockInfos';

jest.mock('../src/lib/transaction');

describe("Block tests", () => {

    let genesisBlock : Block;
    const difficulty = 0;
    const minerWallet = "MINER";

    beforeAll(() => {
        genesisBlock = new Block({
            transactions: [new Transaction({
                data: "Transaction",
                type: TransactionType.FEE
            } as Transaction)] 
        } as Block);
    })

    test('Should be valid', () => {
        const block = new Block({
            index: 1, 
            previousHash: genesisBlock.hash, 
            transactions: [new Transaction({
                data: "Transaction",
                type: TransactionType.REGULAR
            } as Transaction)]
        } as Block);

        block.mine(difficulty, minerWallet);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toEqual(true);
    })

    test('Should create from BlockInfos', () => {
        const block = Block.fromBlockInfos({
            index: 1, 
            previousHash: genesisBlock.hash, 
            transactions: [new Transaction({
                data: "Transaction",
                type: TransactionType.REGULAR
            } as Transaction)],
            difficulty: difficulty,
            maxDifficulty: 62,
            feePerTx: 1
        } as BlockInfos);

        block.mine(difficulty, minerWallet);
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
            transactions: [new Transaction({
                data: "Transaction",
                type: TransactionType.REGULAR
            } as Transaction)],
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
            transactions: [new Transaction({
                data: "Transaction",
                type: TransactionType.REGULAR
            } as Transaction)],
        } as Block);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("Invalid index");
    })

    test('Should not be valid - Transaction', () => {
        const block = new Block({
            index: 1, 
            previousHash: genesisBlock.hash, 
            transactions: [new Transaction({
                type: TransactionType.REGULAR,
                data: ""
            } as Transaction)],
        } as Block);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("Invalid Block due to invalid transaction");
    })

    test('Should not be valid - Timestamp', () => {
        let block = new Block({
            index: 1, 
            previousHash: genesisBlock.hash, 
            transactions:  [new Transaction({
                data: "Transaction",
                type: TransactionType.REGULAR
            } as Transaction)],
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
            transactions:  [new Transaction({
                data: "Transaction",
                type: TransactionType.REGULAR
            } as Transaction)],
        } as Block);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("Invalid previous hash");
    })

    test('Should not be valid - No mined', () => {
        let block = new Block({
            index: 1, 
            previousHash: genesisBlock.hash, 
            transactions:  [new Transaction({
                data: "Transaction",
                type: TransactionType.REGULAR
            } as Transaction)],
        } as Block);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toEqual("No mined");
    })

    test('Should not be valid - Two TransactionType FEE', () => {
        const block = new Block({
            index: 1, 
            previousHash: genesisBlock.hash, 
            transactions: [new Transaction({
                data: "Transaction",
                type: TransactionType.FEE
            } as Transaction),
            new Transaction({
                data: "Transaction 2",
                type: TransactionType.FEE
            } as Transaction)]
        } as Block);

        block.mine(difficulty, minerWallet);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toEqual(false);
        expect(valid.message).toEqual("Two many fees");
    })

    test('Should not be valid - Two TransactionType FEE', () => {
        const block = new Block({
            index: 1, 
            previousHash: genesisBlock.hash, 
            transactions: [new Transaction({
                data: "Transaction",
                type: TransactionType.FEE
            } as Transaction),
            new Transaction({
                data: "Transaction 2",
                type: TransactionType.FEE
            } as Transaction)]
        } as Block);

        block.mine(difficulty, minerWallet);
        const valid = block.isValid(genesisBlock.hash, genesisBlock.index, difficulty);
        expect(valid.success).toEqual(false);
        expect(valid.message).toEqual("Two many fees");
    })
})
