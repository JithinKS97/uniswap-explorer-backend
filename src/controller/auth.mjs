import authService from "../service/auth.mjs";

const getNonce = async (req, res) => {
  const { address } = req.body;
  const nonce = await authService.getNonce(address);
  res.send(nonce);
};

export default {
  getNonce,
};
