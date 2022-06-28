import express from "express";
import { initialiseRoutes } from "./routes/index.mjs";
import cors from "cors";

const port = 8000;

const app = express();

app.use(cors());

app.listen(port, () => {
  console.log(`Uniswap explorer backend listening on port ${port}`);
});

function initialise() {
  initialiseRoutes(app);
}

initialise();
