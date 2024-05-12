import mongoose, { Schema } from "mongoose";
/**
 * Represents a friend request between two users.
 *
 * Fields:
 * - requestTo: ID of the user receiving the request.
 * - requestFrom: ID of the user sending the request.
 * - requestStatus: Status of the request (e.g., "Pending", "Accepted", "Rejected").
 * - timestamps: Automatically generated timestamps for creation and modification of the request.
 *
 * Compiled into a model named "FriendRequest" for database interaction.
 */
const requestSchema = Schema(
  {
    requestTo: { type: Schema.Types.ObjectId, ref: "Users" },
    requestFrom: { type: Schema.Types.ObjectId, ref: "Users" },
    requestStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model("FriendRequest", requestSchema);

export default FriendRequest;