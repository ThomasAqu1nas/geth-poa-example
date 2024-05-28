import { ethers as hhe} from "hardhat";
import {ethers} from "ethers";
import { PollQuestion__factory } from "../typechain-types";

//import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";
import keystore from "../../config/node1/keystore/keystore.json";
import fs from "fs";
import path from "path";
async function main() {
    let promises: Promise< ethers.ContractTransactionReceipt | null>[] = [];
    let provider = new hhe.JsonRpcProvider("http://127.0.0.1:8545");
    const filePath = path.join(__dirname, "../../config/node1/password.txt");
    let password = fs.readFileSync(filePath, "utf-8");
    const private_key = (await hhe.decryptKeystoreJson(JSON.stringify(keystore), password)).privateKey;
    let signer = new hhe.Wallet(private_key, provider);
    let pollQuestionContractFactory = new PollQuestion__factory(signer);
    let contract = await pollQuestionContractFactory.deploy(0, 0, "", "", [], {gasLimit: 5_000_000, gasPrice: 50});
    console.log("contract: ", contract);
    for (let i = 1; i < 3; i ++) {
        let tx = await contract.addVersion(i, `testversion${i}`, "", [], {gasLimit: 5_000_000, gasPrice: 50, nonce: 150 + i});
        let receipt = tx.wait();
        promises.push(receipt)

    }
    let txs = await Promise.all(promises);
    console.log(txs)
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })