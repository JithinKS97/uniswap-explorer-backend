import express from "express";
import { initialiseRoutes } from "./routes/index.mjs";
import cors from "cors";
import connect from "./service/db/index.mjs";
import transactionCacheService from "../src/service/transaction/cache.mjs";
import config from "./config/index.mjs";

const port = 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function initialise() {
  initialiseRoutes(app);
  await connect();
  app.listen(port);
  if (config.useCache) {
    await transactionCacheService.loadCache(64);
  }
  console.log(`Uniswap explorer backend server started`);
}

initialise();
