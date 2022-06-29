import authService from "../service/auth/index.mjs";
import { error } from "../constants/response.mjs";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorisation"];
  if (!authHeader) {
    res.status(401).send(error("Unauthorised request"));
    return;
  }
  const accessToken = authHeader && authHeader.split(" ")[1];
  const result = await authService.verifyAccessToken(accessToken);
  if (result.status) {
    req.user = result.message;
    next();
  } else {
    res.status(401).send(error("Unauthorised request"));
  }
};
