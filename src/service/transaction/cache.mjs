import transactionsService from "./index.mjs";

globalThis.cachedTransactions = {};

const addTransactions = (transactions) => {
  for (let transaction of transactions) {
    globalThis.cachedTransactions[transaction.hash] = transaction;
  }
};

const loadCache = async (hours) => {
  const endBlockNo = await transactionsService.getLastBlockNo();
  const blocksElapsed = transactionsService.getBlocksElapsed(hours);
  const startBlockNo = endBlockNo - blocksElapsed;
  const transactions = await transactionsService.getRawTransactions(
    startBlockNo,
    endBlockNo
  );
  console.log(`Loaded ${transactions.length} transactions to cache`);
  addTransactions(transactions);
};

const getLastBlock = () => {
  const transactions = Object.values(globalThis.cachedTransactions);
  const blockNos = transactions.map((transaction) => transaction.blockNumber);
  const maxBlockNo = Math.max(...blockNos);

  return maxBlockNo;
};

const getTransactions = (startBlockNo, endBlockNo) => {
  const collectedTransactions = [];
  const transactions = Object.values(globalThis.cachedTransactions);
  for (let transaction of transactions) {
    if (
      transaction.blockNumber >= startBlockNo &&
      transaction.blockNumber <= endBlockNo
    ) {
      collectedTransactions.push(transaction);
    }
  }
  return collectedTransactions;
};

export default {
  addTransactions,
  loadCache,
  getLastBlock,
  getTransactions,
};
