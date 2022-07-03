import express from "express";
import { initialiseRoutes } from "./routes/index.mjs";
import cors from "cors";
import connect from "./service/db/index.mjs";
import cacheService from "./service/transaction/cache.mjs";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";

async function initialise() {
  initialiseRoutes(app);
  await connect();
  app.listen(PORT, HOST);
  await cacheService.loadTransactionsCache(64);
  // cacheService.initiateCacheUpdate(15);
  console.log(`Uniswap explorer backend server started`);
}

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });

initialise();
