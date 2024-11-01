import { describe, expect, jest, test } from '@jest/globals';
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionTypeEnum';

jest.mock('../src/lib/block');
jest.mock('../src/lib/transaction');

describe("Blockchain tests", () => {

    test('Should has Genesis block', () => {
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toEqual(1);
    })

    test('Should be Genesis valid ', () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValid().success).toBeTruthy();
    })

    test('Should be valid - Two blocks', () => {
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions: [new Transaction({
                data: "Transaction",
                type: TransactionType.REGULAR
            } as Transaction)] 
        } as Block));
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should add Block', () => {
        const blockchain = new Blockchain();

        const transaction = new Transaction({
            data: "Transaction"
        } as Transaction)
        blockchain.mempool.push(transaction);

        const result = blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions:  [transaction],
        } as Block));

        expect(result.success).toEqual(true);
    })

    test('Should not be valid', () => {
        const blockchain = new Blockchain();

        const transaction = new Transaction({
            data: "Transaction"
        } as Transaction)
        blockchain.mempool.push(transaction);

        blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions:  [transaction],
        } as Block));

        blockchain.blocks[1].index = -1;
        expect(blockchain.isValid().success).toEqual(false);
    })

    test('Should not add Block', () => {
        const blockchain = new Blockchain();
        const block = new Block({
            index: -1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions: [new Transaction()]
        } as Block);
        const result = blockchain.addBlock(block);
        expect(result.success).toEqual(false);
    })

    test('Should get Block', () => {
        const blockchain = new Blockchain();
        const block = blockchain.getBlock(blockchain.blocks[0].hash);
        expect(block).toBeTruthy();
    })

    test('Should get next Block infos', () => {
        const blockchain = new Blockchain();
        blockchain.mempool = [new Transaction({
            data: "Transaction",
            type: TransactionType.REGULAR
        } as Transaction)];
        const infos = blockchain.getNextBlock();

        expect(infos?.index).toEqual(1);
        expect(infos?.previousHash).toEqual(blockchain.blocks[0].hash);
        expect(infos?.difficulty).toEqual(1);
        expect(infos?.maxDifficulty).toEqual(62);
        expect(infos?.feePerTx).toEqual(1);
    })

    test('Should not get next Block infos - Empty mempool', () => {
        const blockchain = new Blockchain();
        const infos = blockchain.getNextBlock();
        expect(infos).toBeNull();
    })

    test('Should get Transaction - Mempool', () => {
        const blockchain = new Blockchain();

        const newTransaction = new Transaction({
            data: "Transaction"
        } as Transaction)
        blockchain.mempool.push(newTransaction);

        const transaction = blockchain.getTransaction("TX2");

        expect(transaction.mempoolIndex).toEqual(0);
    })

    test('Should get Transaction - Blocks', () => {
        const blockchain = new Blockchain();
        const transaction = blockchain.getTransaction("TX");

        expect(transaction.blockIndex).toEqual(0);
    })

    test('Should get Transaction - Not Found', () => {
        const blockchain = new Blockchain();
        const transaction = blockchain.getTransaction("HASH");

        expect(transaction).toEqual({});
    })

    test('Should add Transaction', () => {
        const blockchain = new Blockchain();

        const newTransaction = new Transaction({
            data: "Transaction"
        } as Transaction)

        const result = blockchain.addTransaction(newTransaction);

        expect(result.success).toBeTruthy();
        expect(result.message).toEqual("TX2");
    })

    test('Should not add Transaction - Invalid', () => {
        const blockchain = new Blockchain();

        const newTransaction = new Transaction();

        const result = blockchain.addTransaction(newTransaction);

        expect(result.success).toBeFalsy();
    })

    test('Should not add Transaction - Already exists', () => {
        const blockchain = new Blockchain();

        const newTransaction = new Transaction({
            data: "Transaction"
        } as Transaction)

        newTransaction.hash = "TX";

        const result = blockchain.addTransaction(newTransaction);

        expect(result.success).toBeFalsy();
        expect(result.message).toEqual("Invalid transaction: already exists");
    })

    test('Should not add Transaction - Already exists in mempool', () => {
        const blockchain = new Blockchain();

        const newTransaction = new Transaction({
            data: "Transaction"
        } as Transaction)

        blockchain.mempool.push(newTransaction); 

        const result = blockchain.addTransaction(newTransaction);

        expect(result.success).toBeFalsy();
        expect(result.message).toEqual("Invalid transaction: already exists in mempool");
    })
})
