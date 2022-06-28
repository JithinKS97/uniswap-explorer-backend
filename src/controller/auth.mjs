import authService from "../service/auth.mjs";

const getNonce = (req, res) => {
  const { address } = req.body;
  const nonce = authService.getNonce(address);
  res.send(nonce);
};

export default {
  getNonce,
};
