import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let mongoUrl;
if (process.env.ENV === "local") {
  mongoUrl = "mongodb://localhost:27017/uniswap-explorer";
} else if (process.env.ENV === "prod") {
  mongoUrl = `mongodb+srv://Jithin:${process.env.MONGO_PASSWORD}@cluster0.p5d7p.mongodb.net/uniswap-explorer?retryWrites=true&w=majority`;
}

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
