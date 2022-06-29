import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "../../config/index.mjs";

dotenv.config();

let mongoUrl = config.mongoUrl;

const connect = () => {
  try {
    mongoose.connect(mongoUrl);
    console.log("Connected to mongodb");
  } catch (err) {
    console.log("Error while connecting to DB");
    console.log(err);
  }
};

export default connect;
