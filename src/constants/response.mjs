export const ok = (message) => {
  const response = {
    status: true,
  };
  if (message) {
    response.message = message;
  }
  return response;
};

export const error = (message) => {
  const response = {
    status: false,
  };
  if (message) {
    response.message = message;
  }
  return response;
};
