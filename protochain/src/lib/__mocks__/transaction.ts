import TransactionType from "../transactionTypeEnum";
import Validation from "../validation";

/**
 * Mocked Transaction class
 */
export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    data: string;

    /**
     * Creates a new mock Transaction
     * @param tx The mock Transaction infos
     */
    constructor (tx?: Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.data = tx?.data || "";
        this.hash = tx?.hash || this.getHash();
    }

    getHash() : string {
        return this.type === TransactionType.FEE ? "TX" : "TX2";
    }

    isValid() : Validation {
        if (!this.data) return new Validation(false, "Invalid mock transaction");

        return new Validation();
    }
}