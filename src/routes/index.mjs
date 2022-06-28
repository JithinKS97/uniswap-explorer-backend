import transactionsRouter from "./transactions.mjs";
import serverStatusCheckRouter from "./serverStatusCheck.mjs";
import authRouter from "./auth.mjs";

export const initialiseRoutes = (app) => {
  app.use("/transactions", transactionsRouter);
  app.use("/", serverStatusCheckRouter);
  app.use("/auth", authRouter);
};
