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
  const method = extractMethodName(transaction);
  const input = extractArgs(transaction);
  const extractedValue = {
    method,
    hash: transaction.hash,
    from: transaction.from,
    timestamp: transaction.timestamp,
    value: ethers.utils.formatEther(transaction.value),
    blockNo: transaction.blockNumber,
    input,
  };
  return extractedValue;
}

function extractMethodName(transaction) {
  const data = getTransactionData(transaction);
  return data.name;
}

const getTransactionData = (transaction) => {
  const iface = new ethers.utils.Interface(abi);
  const data = iface.parseTransaction({
    data: transaction.data,
    value: transaction.value,
  });
  return data;
};

function extractArgs(transaction) {
  const data = getTransactionData(transaction);
  let args = data.args.map((arg) => {
    if (arg._isBigNumber) {
      return ethers.utils.formatEther(arg);
    } else {
      return arg;
    }
  });
  const argNames = abi
    .find((item) => item.name === data.name)
    .inputs.map((input) => input.name);
  let inputArgs = {};
  for (let i = 0; i < args.length; i++) {
    inputArgs[argNames[i]] = args[i];
  }
  return inputArgs;
}

export default {
  getUniswapTransactions,
};
