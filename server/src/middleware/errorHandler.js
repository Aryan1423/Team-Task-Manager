export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || (error.name === 'JsonWebTokenError' ? 401 : 500);
  const message = error.code === 'P2002'
    ? 'A record with this value already exists'
    : error.message || 'An error occurred';

  if (process.env.NODE_ENV !== 'test' && statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    message,
    errors: error.errors || []
  });
};
