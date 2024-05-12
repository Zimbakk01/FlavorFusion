import mongoose, { Schema } from "mongoose";
/**
 * Stores email verification tokens.
 *
 * Fields:
 * - userId: ID of the user associated with the token.
 * - token: Verification token.
 * - createdAt: Timestamp of token creation.
 * - expiresAt: Timestamp of token expiration.
 *
 * Compiled into a model named "Verification" for database interaction.
 */
const emailVerificationSchema = Schema({
  userId: String,
  token: String,
  createdAt: Date,
  expiresAt: Date,
});

const Verification = mongoose.model("Verification", emailVerificationSchema);

export default Verification;