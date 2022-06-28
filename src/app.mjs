import express from "express";
import { initialiseRoutes } from "./routes/index.mjs";

const port = 8000;

const app = express();

app.listen(port, () => {
  console.log(`Uniswap explorer backend listening on port ${port}`);
});

function initialise() {
  initialiseRoutes(app);
}

initialise();
