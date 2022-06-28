import transactionsRouter from "./transactions.mjs";
import serverStatusCheckRouter from "./serverStatusCheck.mjs";

export const initialiseRoutes = (app) => {
  app.use("/transactions", transactionsRouter);
  app.use("/", serverStatusCheckRouter);
};
