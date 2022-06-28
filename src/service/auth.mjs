import userService from "./user.mjs";
import crypto from "crypto";
import { User } from "../models/user.mjs";
import { ethers } from "ethers";

const generateNonce = async (address) => {
  const user = await userService.findUserByAddress(address);
  if (!user) {
    await userService.createUser(address);
  }
  const nonce = await addNonceToUser(user);
  return nonce;
};

const addNonceToUser = async (user) => {
  const nonce = crypto.randomBytes(8).toString("base64url");
  await user.updateOne({
    $set: {
      nonce,
    },
  });
  return nonce;
};

const verifyNonce = async (signature, nonceInRequest) => {
  try {
    const message = `Signing this message with nonce:${nonceInRequest}`;
    const address = ethers.utils.verifyMessage(message, signature);
    const savedNonce = await getNonceOfUser(address);
    return savedNonce === nonceInRequest;
  } catch (err) {
    console.log(`Unable to verify nonce ${err}`);
    return false;
  }
};

const getNonceOfUser = async (address) => {
  address = address.toLowerCase();
  const user = await User.findOne({ address });
  return user.nonce;
};

export default {
  generateNonce,
  verifyNonce,
};
