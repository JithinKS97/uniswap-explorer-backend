import config from "../../config/index.mjs";
import ethers from "ethers";
import dotEnv from "dotenv";
import { abi } from "./uniswapContractAbi.mjs";

// Getting the config
dotEnv.config();
const provider = new ethers.providers.EtherscanProvider(
  config.chain,
  process.env.ETHERSCAN_API_KEY
);
const blockTime = 15;

/**
 * Returns uniswap transactions for last n hours
 * @param {Number} hours
 */
async function getUniswapTransactions(hours) {
  const endBlockNumber = await provider.getBlockNumber();
  const startBlockNumber = endBlockNumber - (hours * 60 * 60) / blockTime;
  const transactions = await provider.getHistory(
    config.uniswapContractAddress,
    startBlockNumber,
    endBlockNumber
  );

  return transactions.map(extractRelevantDetails).reverse();
}

function extractRelevantDetails(transaction) {
  const method = extractMethod(transaction);
  const extractedValue = {
    method,
    hash: transaction.hash,
    from: transaction.from,
    timestamp: transaction.timestamp,
    value: ethers.utils.formatEther(transaction.value),
    blockNo: transaction.blockNumber,
  };
  return extractedValue;
}

function extractMethod(transaction) {
  const iface = new ethers.utils.Interface(abi);
  const data = iface.parseTransaction({
    data: transaction.data,
    value: transaction.value,
  });
  return data.name;
}

export default {
  getUniswapTransactions,
};
