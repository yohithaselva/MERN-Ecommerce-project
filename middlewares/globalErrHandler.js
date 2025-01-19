export const globalErrHandler = (err, req, res, next) => {
  //stack line of code err is in
  //msg
  //statuscode
  const stack = err?.stack;
  const message = err?.message;
  const status = err?.statusCode ? err?.statusCode : 500;
  res.status(status).json({
    stack,
    message,
  });
};

//404 Handler
export const notFound = (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  next(err);
};
