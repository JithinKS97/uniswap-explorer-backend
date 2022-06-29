import config from "../../config/index.mjs";
import ethers from "ethers";
import dotEnv from "dotenv";
import { abi } from "./uniswapContractAbi.mjs";
import cacheService from "./cache.mjs";

// Getting the config
dotEnv.config();
const provider = new ethers.providers.EtherscanProvider(
  config.chain,
  process.env.ETHERSCAN_API_KEY
);
const blockTime = 15;

const getRelevantTransactionDetails = async (hours) => {
  const endBlockNo = await getLastBlockNo();
  const blocksElapsed = getBlocksElapsed(hours);
  const startBlockNo = endBlockNo - blocksElapsed;
  let allTransactions = [];
  if (config.useCache) {
    const transactionsInCache = cacheService.getTransactions(startBlockNo);
    const cacheLastBlockNo = cacheService.getLastBlock();
    const transactionsFetched = await getRawTransactions(
      cacheLastBlockNo + 1,
      endBlockNo
    );
    console.log(
      `fetched:${transactionsFetched.length}, cache:${transactionsInCache.length}`
    );
    cacheService.addTransactions(transactionsFetched);
    allTransactions = [...transactionsFetched, ...transactionsInCache];
  } else {
    const transactionsFetched = await getRawTransactions(
      startBlockNo,
      endBlockNo
    );
    allTransactions = transactionsFetched;
  }
  allTransactions = allTransactions.sort(
    (a, b) => b.blockNumber - a.blockNumber
  );
  return allTransactions.map(extractRelevantDetails);
};

const getLastBlockNo = async () => {
  const lastBlockNo = await provider.getBlockNumber();
  return lastBlockNo;
};

const getBlocksElapsed = (hours) => {
  const blockNo = (hours * 60 * 60) / blockTime;
  return blockNo;
};

const getRawTransactions = async (startBlockNo, endBlockNo) => {
  const transactions = await provider.getHistory(
    config.uniswapContractAddress,
    startBlockNo,
    endBlockNo
  );
  return transactions;
};

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
  getRelevantTransactionDetails,
  getRawTransactions,
  getLastBlockNo,
  getBlocksElapsed,
};
