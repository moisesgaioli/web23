/**
 * The information to make mining possible
 */
export default interface BlockInfos {
    index: number;
    previousHash: string;
    difficulty: number;
    maxDifficulty : number;
    feePerTx: number;
    data: string;
}
