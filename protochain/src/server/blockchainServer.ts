import express from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";
import Block from "../lib/block";
import Transaction from "../lib/transaction";

const PORT : number = 3000;

const app = express();

if (process.argv.includes("--run"))
    app.use(morgan('tiny'));

app.use(express.json());

const blockchain = new Blockchain();

app.get('/status', (req, res, next) => {
    res.json({
        mempool: blockchain.mempool.length,
        blocks: blockchain.blocks.length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    })
});

app.get('/block/next', (req, res, next) => {
        res.json(blockchain.getNextBlock());
});

app.get('/block/:indexOrHash', (req, res, next) => {
    let block: Block | undefined;

    if (/^[0-9]+$/.test(req.params.indexOrHash))
        block = blockchain.blocks[parseInt(req.params.indexOrHash)];
    else
        block = blockchain.getBlock(req.params.indexOrHash);

    if (!block)
        res.sendStatus(404);
    else
        res.json(block);
});

app.post('/block', (req, res, next) => {
    if (req.body.hash === undefined) res.sendStatus(422);

    const block = new Block(req.body as Block);
    const validation = blockchain.addBlock(block);

    if (validation.success)
        res.status(201).json(block);
    else
        res.status(400).json(validation)
});

app.get('/transactions/:hash?', (req, res, next) => {
    if (req.params.hash)
        res.json(blockchain.getTransaction(req.params.hash)) 
    else
        res.json({
            next: blockchain.mempool.slice(0, Blockchain.TRANSACTION_PEER_BLOCK),
            total: blockchain.mempool.length
        });
});

app.post('/transactions', (req, res, next) => {
    if (req.body.hash === undefined) res.sendStatus(422);

    const transaction = new Transaction(req.body as Transaction);
    const validation = blockchain.addTransaction(transaction);

    if (validation.success)
        res.status(201).json(transaction);
    else
        res.status(400).json(validation)
});

if (process.argv.includes("--run")) 
    app.listen(PORT, () => { console.log("Online") });

export { app }
