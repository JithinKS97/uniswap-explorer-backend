import userService from "./user.mjs";
import crypto from "crypto";
import { User } from "../models/user.mjs";

const getNonce = async (address) => {
  const user = await userService.findUserByAddress(address);
  if (!user) {
    await userService.createUser(address);
  }
  const nonce = await addNonceToUser(user);
  return nonce;
};

const addNonceToUser = async (user) => {
  const nonce = crypto.randomBytes(8).toString("base64url");
  await User.updateOne(
    {
      address: user.address,
    },
    {
      $set: {
        nonce: nonce,
      },
    }
  );
  return nonce;
};

export default {
  getNonce,
};
