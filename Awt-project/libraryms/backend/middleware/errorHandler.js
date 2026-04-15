// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export default errorHandler;
