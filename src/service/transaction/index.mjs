import config from "../../config/index.mjs";
import ethers from "ethers";
import dotEnv from "dotenv";

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
  console.log(transactions);
  return transactions.map(extractRelevantDetails).reverse();
}

function extractRelevantDetails(transaction) {
  const extractedValue = {
    hash: transaction.hash,
    from: transaction.from,
    timestamp: transaction.timestamp,
    value: ethers.utils.formatEther(transaction.value),
    blockNo: transaction.blockNumber,
  };
  return extractedValue;
}

export default {
  getUniswapTransactions,
};