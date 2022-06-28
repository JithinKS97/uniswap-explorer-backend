const getStatus = () => {
  return {
    service: "Uniswap explorer service",
    status: "Up",
    timeStamp: Date.now(),
  };
};

export default {
  getStatus,
};
