import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

/**
 * Hashes a string using bcrypt with a salt round of 10.
 *
 * @param useValue the string to be hashed
 * @return Promise<string> a Promise that resolves with the hashed string
 * @throws Error if hashing fails
 */
export const hashString = async (useValue) => {
  const salt = await bcrypt.genSalt(10);

  const hashedpassword = await bcrypt.hash(useValue, salt);
  return hashedpassword;
};
/**
 * Compares a plaintext string with a hashed password using bcrypt.
 *
 * @param userPassword the plaintext password to be compared
 * @param password the hashed password to be compared against
 * @return Promise<boolean> a Promise that resolves with a boolean indicating whether the plaintext password matches the hashed password
 * @throws Error if comparison fails
 */
export const compareString = async (userPassword, password) => {
  const isMatch = await bcrypt.compare(userPassword, password);
  return isMatch;
};

/**
 * Creates a JSON Web Token (JWT) for a user identifier.
 *
 * @param id the user identifier to be encoded in the JWT
 * @return string the generated JWT
 */
export function createJWT(id) {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
}
