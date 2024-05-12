import mongoose, { Schema } from "mongoose";

/**
 * Represents a user registered in the application.
 *
 * Fields:
 * - firstName: First name of the user.
 * - lastName: Last name of the user.
 * - email: Email address of the user.
 * - password: Hashed password of the user.
 * - location: Location of the user.
 * - profileUrl: URL of the user's profile picture.
 * - profession: Profession of the user.
 * - friends: Array of user IDs representing the user's friends.
 * - views: Array of user IDs who viewed the user's profile.
 * - verified: Boolean indicating whether the user's email address is verified.
 * - timestamps: Automatically generated timestamps for creation and modification of the user profile.
 *
 * Compiled into a model named "Users" for database interaction.
 */
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required!"],
    },
    email: {
      type: String,
      required: [true, " Email is Required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: true,
    },
    location: { type: String },
    profileUrl: { type: String },
    profession: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    views: [{ type: String }],
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;