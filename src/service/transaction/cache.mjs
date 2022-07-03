import transactionService from "./index.mjs";

globalThis.cachedTransactions = [];

const loadTransactionsCache = async (hours) => {
  const endBlockNo = await transactionService.getLastBlockNo();
  const elapsedBlockNo = transactionService.getBlocksElapsed(hours);
  const startBlockNo = endBlockNo - elapsedBlockNo;
  const transactions = await transactionService.getRawTransactions(
    startBlockNo,
    endBlockNo
  );
  const relevantDetails = transactions
    .map(transactionService.extractRelevantDetails)
    .filter((txn) => txn);
  globalThis.lastBlockNo = endBlockNo;
  addTransactionsToCache(relevantDetails);
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
    (transaction) => transaction.blockNo
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
  const relevantDetails = transactions
    .map(transactionService.extractRelevantDetails)
    .filter((txn) => txn);
  console.log(
    `cache last block: ${maxBlockNoInCache}, last block:${lastBlockNo}`
  );
  flushCache(lastBlockNo);
  addTransactionsToCache(relevantDetails);
};

const flushCache = (lastBlockNo) => {
  const elapsedBlockNo = transactionService.getBlocksElapsed(64);
  const startBlockNo = lastBlockNo - elapsedBlockNo;
  for (let i = 0; i < globalThis.cachedTransactions.length; i++) {
    if (globalThis.cachedTransactions[i].blockNo < startBlockNo) {
      console.log(
        `Flushing cache block number ${globalThis.cachedTransactions[i].blockNo}`
      );
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

const getTransactionsInTransactionsList = (startTime, endTime) => {
  const collectedTransactions = [];
  for (let transaction of globalThis.cachedTransactions) {
    if (
      transaction.timestamp >= startTime &&
      transaction.timestamp <= endTime
    ) {
      collectedTransactions.push(transaction);
    }
  }
  return collectedTransactions;
};

const getTransactionsFromCache = (hours) => {
  const currentTimeStamp = Date.now() / 1000;
  const startTimeStamp = (Date.now() - hours * 60 * 60 * 1000) / 1000;
  return getTransactionsInTransactionsList(startTimeStamp, currentTimeStamp);
};

export default {
  loadTransactionsCache,
  initiateCacheUpdate,
  getTransactionsFromCache,
};
