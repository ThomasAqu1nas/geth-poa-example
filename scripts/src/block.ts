import { ethers } from "ethers";

async function main() {
    let provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    console.log(await provider.getBlockNumber());
}

main()
.catch((err) => {
    console.error(err);
    process.exit(1);
})
