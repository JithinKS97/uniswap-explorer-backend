import { User } from "../models/user.mjs";

const findUserByAddress = async (address) => {
  const user = await User.findOne({ address });
  return user;
};

const createUser = async (address) => {
  address = address.toLowerCase();
  const newUser = new User({ address });
  return await newUser.save();
};

export default {
  findUserByAddress,
  createUser,
};
