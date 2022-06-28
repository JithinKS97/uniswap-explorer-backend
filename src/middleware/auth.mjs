import authService from "../service/auth.mjs";
import { error } from "../constants/response.mjs";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["Authorisation"];
  if (!authHeader) {
    res.status(401).send(error("Unauthorised request"));
    return;
  }
  const accessToken = authHeader && authHeader.split(" ")[1];
  const result = authService.verifyAccessToken(accessToken);
  if (result.status) {
    req.user = result.message;
    next();
  } else {
    res.status(401).send(error("Unauthorised request"));
  }
};
