import authService from "../service/auth.mjs";
import { ok, error } from "../constants/response.mjs";

const getNonce = async (req, res) => {
  const { address } = req.body;
  const nonce = await authService.generateNonce(address);
  res.send(ok(nonce));
};

const verify = async (req, res) => {
  const { signature, nonce } = req.body;
  const isVerified = await authService.verifyNonce(signature, nonce);
  if (isVerified) {
    res.send(ok());
  } else {
    res.send(error("Unable to authenticate user"));
  }
};

export default {
  getNonce,
  verify,
};
