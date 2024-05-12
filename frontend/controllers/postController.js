import Comments from "../models/commentModel.js";
import Posts from "../models/postModel.js";
import Users from "../models/userModel.js";

/**
 * Creates a new post.
 * Validates required fields, creates a new post in the database,
 * and sends a success response with the created post data.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const createPost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { description, image } = req.body;

    if (!description) {
      next("You must provide a description");
      return;
    }

    const post = await Posts.create({
      userId,
      description,
      image,
    });

    res.status(200).json({
      sucess: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

/**
 * Retrieves posts.
 * Retrieves posts from the database based on search criteria,
 * filters posts based on user's friends,
 * and sends a success response with the retrieved posts.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const getPosts = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { search } = req.body;

    const user = await Users.findById(userId);
    const friends = user?.friends?.toString().split(",") ?? [];
    friends.push(userId);

    const searchPostQuery = {
      $or: [
        {
          description: { $regex: search, $options: "i" },
        },
      ],
    };

    const posts = await Posts.find(search ? searchPostQuery : {})
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    const friendsPosts = posts?.filter((post) => {
      return friends.includes(post?.userId?._id.toString());
    });

    const otherPosts = posts?.filter(
      (post) => !friends.includes(post?.userId?._id.toString())
    );

    let postsRes = null;

    if (friendsPosts?.length > 0) {
      postsRes = search ? friendsPosts : [...friendsPosts, ...otherPosts];
    } else {
      postsRes = posts;
    }

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: postsRes,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
/**
 * Retrieves a specific post by ID.
 * Retrieves a post from the database based on the provided post ID,
 * and sends a success response with the retrieved post.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Posts.findById(id).populate({
      path: "userId",
      select: "firstName lastName location profileUrl -password",
    });
    // .populate({
    //   path: "comments",
    //   populate: {
    //     path: "userId",
    //     select: "firstName lastName location profileUrl -password",
    //   },
    //   options: {
    //     sort: "-_id",
    //   },
    // })
    // .populate({
    //   path: "comments",
    //   populate: {
    //     path: "replies.userId",
    //     select: "firstName lastName location profileUrl -password",
    //   },
    // });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
/**
 * Retrieves posts by a specific user.
 * Retrieves posts from the database based on the provided user ID,
 * and sends a success response with the retrieved posts.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const getUserPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Posts.find({ userId: id })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
/**
 * Retrieves comments for a specific post.
 * Retrieves comments from the database based on the provided post ID,
 * and sends a success response with the retrieved comments.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const postComments = await Comments.find({ postId })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .populate({
        path: "replies.userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: postComments,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
/**
 * Likes or unlikes a post.
 * Retrieves the post by ID, updates the likes field based on the user's action,
 * and sends a success response with the updated post.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const likePost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;

    const post = await Posts.findById(id);

    const index = post.likes.findIndex(pid => pid === String(userId));

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter(pid => pid !== String(userId));
    }

    // Update only the likes field
    const updatedPost = await Posts.findByIdAndUpdate(id, { likes: post.likes }, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Post liked/unliked successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Likes or unlikes a comment on a post.
 * Retrieves the comment by ID, updates the likes field based on the user's action,
 * and sends a success response with the updated comment.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const likePostComment = async (req, res, next) => {
  const { userId } = req.body.user;
  const { id, rid } = req.params;

  try {
    if (rid === undefined || rid === null || rid === `false`) {
      const comment = await Comments.findById(id);

      const index = comment.likes.findIndex((el) => el === String(userId));

      if (index === -1) {
        comment.likes.push(userId);
      } else {
        comment.likes = comment.likes.filter((i) => i !== String(userId));
      }

      const updated = await Comments.findByIdAndUpdate(id, comment, {
        new: true,
      });

      res.status(201).json(updated);
    } else {
      const replyComments = await Comments.findOne(
        { _id: id },
        {
          replies: {
            $elemMatch: {
              _id: rid,
            },
          },
        }
      );

      const index = replyComments?.replies[0]?.likes.findIndex(
        (i) => i === String(userId)
      );

      if (index === -1) {
        replyComments.replies[0].likes.push(userId);
      } else {
        replyComments.replies[0].likes = replyComments.replies[0]?.likes.filter(
          (i) => i !== String(userId)
        );
      }

      const query = { _id: id, "replies._id": rid };

      const updated = {
        $set: {
          "replies.$.likes": replyComments.replies[0].likes,
        },
      };

      const result = await Comments.updateOne(query, updated, { new: true });

      res.status(201).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
/**
 * Adds a comment to a post.
 * Creates a new comment in the database, associates it with the post,
 * and sends a success response with the created comment.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const commentPost = async (req, res, next) => {
  try {
    const { comment, from } = req.body;
    const { userId } = req.body.user;
    const { id } = req.params;

    if (comment === null) {
      return res.status(404).json({ message: "Comment is required." });
    }

    const newComment = new Comments({ comment, from, userId, postId: id });

    await newComment.save();

    //updating the post with the comments id
    const post = await Posts.findById(id);

    post.comments.push(newComment._id);

    const updatedPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
/**
 * Adds a reply to a comment on a post.
 * Creates a new reply to a comment in the database,
 * and sends a success response with the updated comment containing the new reply.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const replyPostComment = async (req, res, next) => {
  const { userId } = req.body.user;
  const { comment, replyAt, from } = req.body;
  const { id } = req.params;

  if (comment === null) {
    return res.status(404).json({ message: "Comment is required." });
  }

  try {
    const commentInfo = await Comments.findById(id);

    commentInfo.replies.push({
      comment,
      replyAt,
      from,
      userId,
      created_At: Date.now(),
    });

    commentInfo.save();

    res.status(200).json(commentInfo);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
/**
 * Deletes a post.
 * Deletes a post from the database based on the provided post ID,
 * and sends a success response upon deletion.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Posts.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};