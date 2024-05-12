
/**
 * Error handling middleware for Express.js applications.
 * Handles various types of errors and sends appropriate error responses.
 *
 * @param err the error object passed to the middleware
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 */
const errorMiddleware = (err, req, res, next) => {
    const defaultError = {
      statusCode: 404,
      success: "failed",
      message: err,
    };
  
    if (err?.name === "ValidationError") {
      defaultError.statusCode = 404;
  
      defaultError.message = Object.values(err, errors)
        .map((el) => el.message)
        .join(",");
    }
  
    //duplicate error
  
    if (err.code && err.code === 11000) {
      defaultError.statusCode = 404;
      defaultError.message = `${Object.values(
        err.keyValue
      )} field has to be unique!`;
    }
  
    res.status(defaultError.statusCode).json({
      success: defaultError.success,
      message: defaultError.message,
    });
  };
  
  export default errorMiddleware;