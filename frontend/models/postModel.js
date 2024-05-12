import mongoose, { Schema } from "mongoose";

/**
 * Represents a post made by a user.
 *
 * Fields:
 * - userId: ID of the user who made the post.
 * - description: Text description of the post.
 * - image: URL of the image associated with the post.
 * - likes: Array of user IDs who liked the post.
 * - comments: Array of comment IDs associated with the post.
 * - timestamps: Automatically generated timestamps for creation and modification of the post.
 *
 * Compiled into a model named "Posts" for database interaction.
 */
const postSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    description: { type: String, required: true },
    image: { type: String },
    likes: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
  },
  { timestamps: true }
);

const Posts = mongoose.model("Posts", postSchema);

export default Posts;