import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  nonce: {
    type: String,
  },
});

export const User = mongoose.model("user", userSchema);
