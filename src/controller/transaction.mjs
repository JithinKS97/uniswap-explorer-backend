import transactionsService from "../service/transaction/index.mjs";

const getTransactions = async (req, res) => {
  const transactions = await transactionsService.getUniswapTransactions(1);
  res.send(transactions);
};

export default {
  getTransactions,
};
