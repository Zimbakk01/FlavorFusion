import mongoose, { Schema } from "mongoose";

/**
 * Represents a comment made by a user on a post.
 *
 * Fields:
 * - userId: ID of the user who made the comment.
 * - postId: ID of the post the comment is associated with.
 * - comment: Text content of the comment.
 * - from: Source of the comment.
 * - replies: Array of reply objects containing details of replies to the comment.
 *   - rid: ID of the reply.
 *   - userId: ID of the user who made the reply.
 *   - from: Source of the reply.
 *   - replyAt: Time at which the reply was made.
 *   - comment: Text content of the reply.
 *   - created_At: Timestamp of reply creation.
 *   - updated_At: Timestamp of reply update.
 *   - likes: Array of user IDs who liked the reply.
 * - likes: Array of user IDs who liked the comment.
 * - timestamps: Automatically generated timestamps for creation and modification of the comment.
 *
 * Compiled into a model named "Comments" for database interaction.
 */
const commentSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    postId: { type: Schema.Types.ObjectId, ref: "Posts" },
    comment: { type: String, required: true },
    from: { type: String, required: true },
    replies: [
      {
        rid: { type: mongoose.Schema.Types.ObjectId },
        userId: { type: Schema.Types.ObjectId, ref: "Users" },
        from: { type: String },
        replyAt: { type: String },
        comment: { type: String },
        created_At: { type: Date, default: Date.now() },
        updated_At: { type: Date, default: Date.now() },
        likes: [{ type: String }],
      },
    ],
    likes: [{ type: String }],
  },
  { timestamps: true }
);

const Comments = mongoose.model("Comments", commentSchema);

export default Comments;