import transactionsService from "../service/transaction/index.mjs";

const getTransactions = async (req, res) => {
  const { time } = req.body;
  const transactions = await transactionsService.getRelevantTransactionDetails(
    Number(time)
  );
  res.send(transactions);
};

export default {
  getTransactions,
};
