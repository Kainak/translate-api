export default (err, req, res, next) => {
  const { code, message } = err;

  if (message) {
    console.error(message);
  }

  res.status(404).json({
    code,
    message,
  });
};
