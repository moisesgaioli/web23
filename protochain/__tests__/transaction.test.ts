import { describe, expect, test } from '@jest/globals';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionTypeEnum';

describe("Transaction tests", () => {

    test('Should be valid - DEFAULT', () => {
        const tx = new Transaction({
            data: "Transaction"
        } as Transaction);
        
        expect( tx.isValid().success).toEqual(true);
    })

    test('Should be valid - FEE', () => {
        const tx = new Transaction({
            data: "Transaction",
            type: TransactionType.FEE
        } as Transaction);
        
        expect( tx.isValid().success).toEqual(true);
    })

    test('Should not be valid - Data', () => {
        const tx = new Transaction({
            data: "",
            type: TransactionType.REGULAR
        } as Transaction);
        
        expect( tx.isValid().success).toEqual(false);
    })

    test('Should be valid - REGULAR', () => {
        const tx = new Transaction({
            data: "Transaction",
            type: TransactionType.REGULAR,
            timestamp: Date.now(),
            hash: "hash"
        } as Transaction);
        
        expect( tx.isValid().success).toEqual(false);
    })

    test('Should not be valid - Data', () => {
        let tx = new Transaction();
        expect( tx.isValid().success).toEqual(false);
    })
})
