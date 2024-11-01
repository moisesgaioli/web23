import axios from "axios";
import BlockInfos from "../lib/blockInfos";
import Block from "../lib/block";

const BLOCKCHAIN_SERVER = "http://localhost:3000";
const minerWallet = "Wallet";
let coin = 0;

async function mine() {
    console.log("Start")
    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/block/next`);

    if (!data){
        console.log("No transaction found")
        return setTimeout(() => {
            mine();
        }, 5000)
    }
    const blockInfos = data as BlockInfos;
    
    const newBlock = Block.fromBlockInfos(blockInfos);

    console.log("Mineirando bloco ...")
    newBlock.mine(blockInfos.difficulty, minerWallet);
    console.log("Aguardando validação da blockchain ...")
    
    try {
        await axios.post(`${BLOCKCHAIN_SERVER}/block`, newBlock);
        coin++;
        console.log(`Mineirado ${coin} BTC`);
    } catch (error : any) {
        console.error(error.response ? error.response.data : error.message);
    }

    setTimeout(() => {
        mine();
    }, 1000)  
}

mine();
