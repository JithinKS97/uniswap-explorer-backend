import serverStatusCheckService from "../service/serverStatusCheck/index.mjs";

const getStatus = (req, res) => {
  const status = serverStatusCheckService.getStatus();
  res.send(status);
};

export default {
  getStatus,
};
