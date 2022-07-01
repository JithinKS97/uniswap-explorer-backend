import transactionService from "./index.mjs";

globalThis.cachedTransactions = [];

const loadTransactionsCache = async () => {
  const endBlockNo = await transactionService.getLastBlockNo();
  const elapsedBlockNo = transactionService.getBlocksElapsed(64);
  const startBlockNo = endBlockNo - elapsedBlockNo;
  const transactions = await transactionService.getRawTransactions(
    startBlockNo,
    endBlockNo
  );
  addTransactionsToCache(transactions);
  console.log(
    `loaded ${globalThis.cachedTransactions.length} transactions in cache`
  );
};

const addTransactionsToCache = (transactions) => {
  for (let transaction of transactions) {
    globalThis.cachedTransactions.push(transaction);
  }
};

const getLastBlockNoInCache = () => {
  const blockNos = globalThis.cachedTransactions.map(
    (transaction) => transaction.blockNumber
  );
  const maxBlockNoInCache = Math.max(...blockNos);
  return maxBlockNoInCache;
};

const updateCache = async () => {
  const lastBlockNo = await transactionService.getLastBlockNo();
  globalThis.lastBlockNo = lastBlockNo;
  const maxBlockNoInCache = getLastBlockNoInCache();
  const transactions = await transactionService.getRawTransactions(
    maxBlockNoInCache + 1,
    lastBlockNo
  );
  console.log(
    `cache last block: ${maxBlockNoInCache}, last block:${lastBlockNo}`
  );
  flushCache(lastBlockNo);
  addTransactionsToCache(transactions);
};

const flushCache = (lastBlockNo) => {
  const elapsedBlockNo = transactionService.getBlocksElapsed(6);
  const startBlockNo = lastBlockNo - elapsedBlockNo;
  for (let i = 0; i < globalThis.cachedTransactions; i++) {
    if (globalThis.cachedTransactions[i].blockNumber < startBlockNo) {
      console.log("Flushing cache");
      globalThis.cachedTransactions.splice(i, 1);
    }
  }
};

const initiateCacheUpdate = (timeInterval) => {
  setInterval(() => {
    console.log("Updating cache");
    updateCache();
  }, timeInterval * 1000);
};

const getTransactionsInTransactionsList = (startBlockNo, endBlockNo) => {
  const collectedTransactions = [];
  for (let transaction of globalThis.cachedTransactions) {
    if (
      transaction.blockNumber >= startBlockNo &&
      transaction.blockNumber <= endBlockNo
    ) {
      collectedTransactions.push(transaction);
    }
  }
  return collectedTransactions;
};

const getTransactionsFromCache = (hours) => {
  const lastBlockNo = globalThis.lastBlockNo;
  const elapsedBlockNo = transactionService.getBlocksElapsed(hours);
  const startBlockNo = lastBlockNo - elapsedBlockNo;
  return getTransactionsInTransactionsList(startBlockNo, lastBlockNo);
};

export default {
  loadTransactionsCache,
  initiateCacheUpdate,
  getTransactionsFromCache,
};
