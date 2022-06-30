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
const blockTime = 13;

const getRelevantTransactionDetails = async (hours) => {
  const endBlockNo = await getLastBlockNo();
  const blocksElapsed = getBlocksElapsed(hours);
  const startBlockNo = endBlockNo - blocksElapsed;
  const transactions = await getRawTransactions(startBlockNo, endBlockNo);
  return transactions
    .map(extractRelevantDetails)
    .sort((a, b) => b.blockNo - a.blockNo);
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
  const txn = getTransactionData(transaction);

  let args = txn.args.map((arg) => {
    if (arg._isBigNumber) {
      return ethers.utils.formatEther(arg);
    } else {
      return arg;
    }
  });

  const argNames = abi
    .find((fn) => fn.name === txn.name)
    .inputs.map((input) => input.name);

  let inputArgs = {};

  for (let i = 0; i < args.length; i++) {
    if (argNames[i] === "deadline") {
      const timestamp = Number(args[i]) * 10 ** 21;
      inputArgs[argNames[i]] = new Date(timestamp).toLocaleString();
    } else if (argNames[i] !== "path") {
      inputArgs[argNames[i]] = args[i].toString();
    } else {
      inputArgs[argNames[i]] = args[i];
    }
  }

  return inputArgs;
}

export default {
  getRelevantTransactionDetails,
  getRawTransactions,
  getLastBlockNo,
  getBlocksElapsed,
};
