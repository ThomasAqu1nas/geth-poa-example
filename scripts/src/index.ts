import { TransactionResponse, ethers } from "ethers";
import abi from "../abi.json";
;
import dotenv from "dotenv";

type data = {
    block_number: number
    transactions: number,
    timestamp: number
    
}

async function main() {
    let provider = new ethers.IpcSocketProvider("/home/ando/Documents/geth-dev/geth_node/geth.ipc");
    const nodeAccount = new ethers.JsonRpcSigner(provider, "0x859F97947f5D7aC75f1115f5E84b03713ab0C580");
    console.log("signer address: ", await nodeAccount.getAddress());
    const contract = new ethers.Contract("0x41687Aa0b0FC3727AC5B9D201bd39f48E40f70B0", abi, nodeAccount);
    let start_block = await provider.getBlockNumber();
    let txs: Array<data> = [];

    let promises: Promise<any>[] = [];
    let start = performance.now();
    //gen
    for (let i = 50; i < 55; i++) {
        promises.push(contract["addVersion"](i, `testversion${i}`, "", [], {gasLimit: 1_000_000, gasPrice: 100_000, nonce: 20 + i}))
    }
    let wait = await Promise.all(promises);
    let end = performance.now()
    console.log("async transactions sending duration: ", end - start, " milliseconds");
    //console.log("wait: ", wait)
    let end_block = await provider.getBlockNumber();

    for (let i = start_block; i <= end_block; i++) {
        let block = await provider.getBlock(i);
        if (block) {
            txs.push({
                block_number: block.number,
                transactions: block.transactions.length,
                timestamp: block.timestamp
            });
        } else {
            txs.push({
                block_number: 0,
                transactions: 0,
                timestamp: 0
            })
        }

    }

    //let s = await contract["addVersion"](3, "testversion", "", [], {gasLimit: 1_000_000});
    let res = await contract["CurrentVersion"]();
    console.log("res: ", res);

    console.log("data: ", txs);
}



main().catch(console.error);
