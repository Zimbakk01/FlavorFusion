import mongoose, { Schema } from "mongoose";
/**
 * Stores password reset tokens.
 *
 * Fields:
 * - userId: ID of the user associated with the token.
 * - email: Email address of the user.
 * - token: Password reset token.
 * - createdAt: Timestamp of token creation.
 * - expiresAt: Timestamp of token expiration.
 *
 * Compiled into a model named "PasswordReset" for database interaction.
 */
const passwordResetSchema = Schema({
  userId: { type: String, unique: true },
  email: { type: String, unique: true },
  token: String,
  createdAt: Date,
  expiresAt: Date,
});

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);

export default PasswordReset;