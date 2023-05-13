const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // eslint-disable-next-line eqeqeq
  if (process.env.NODE_ENV == "development") {
    // eslint-disable-next-line no-use-before-define
    sendErrorForDev(err, res);
  } else {

    // eslint-disable-next-line no-use-before-define
    sendErrorForProd(err, res);
  }
};

const sendErrorForDev = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    "status Code": err.statusCode,
    error: err,
    Message: err.message,
    stack: err.stack,
  });

const sendErrorForProd = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    "status Code": err.statusCode,
    Message: err.message,
  });

module.exports = globalError;
