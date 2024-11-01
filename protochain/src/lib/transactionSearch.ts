import Transaction from "./transaction";

export default interface TransactionSearch {
    mempoolIndex: number;
    transaction: Transaction;
    blockIndex: number;
}