import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

/**
 * Registers a new user.
 * Validates required fields, checks if the email address already exists,
 * hashes the password, creates a new user in the database,
 * and sends an email verification to the user.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  //validate fileds
  if (!(firstName || lastName || email || password)) {
    next("Provide Required Fields!");
    return;
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Email Address already exists");
      return;
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    //send email verification to user
    sendVerificationEmail(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

/**
 * Logs in a user.
 * Validates user credentials, finds the user by email, checks if the email is verified,
 * compares the provided password with the stored hashed password,
 * generates a JWT token for authentication, and sends a success response with the token.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide User Credentials");
      return;
    }

    // find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });

    if (!user) {
      next("Invalid email or password");
      return;
    }

    if (!user?.verified) {
      next(
        "User email is not verified. Check your email account and verify your email"
      );
      return;
    }

    // compare password
    const isMatch = await compareString(password, user?.password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    user.password = undefined;

    const token = createJWT(user?._id);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};