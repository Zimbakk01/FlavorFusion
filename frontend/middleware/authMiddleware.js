import JWT from "jsonwebtoken";

/**
 * Middleware for user authentication in Express.js applications.
 * Verifies the JWT token provided in the request header and attaches user information to the request body.
 * If authentication fails, calls the next middleware with an error message.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    next("Authentication== failed");
  }

  const token = authHeader?.split(" ")[1];

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.log(error);
    next("Authentication failed");
  }
};

export default userAuth;