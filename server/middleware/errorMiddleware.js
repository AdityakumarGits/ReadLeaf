export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, next) => {
  const status =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res
    .status(status)
    .json({ message: error.message || "Something went wrong." });
};
