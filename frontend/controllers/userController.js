import mongoose from "mongoose";
import Verification from "../models/emailVerification.js";
import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import PasswordReset from "../models/PasswordReset.js";
import { resetPasswordLink } from "../utils/sendEmail.js";
import FriendRequest from "../models/friendRequest.js";

/**
 * Verifies the email address of a user based on the provided verification token and user ID.
 * Checks the validity of the token and updates the user's verification status accordingly.
 * If the verification fails, redirects the user with an appropriate error message.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @return void
 */
export const verifyEmail = async (req, res) => {
    const { userId, token } = req.params;
  
    try {
      const result = await Verification.findOne({ userId });
  
      if (result) {
        const { expiresAt, token: hashedToken } = result;
  
        if (expiresAt < Date.now()) {
          Verification.findOneAndDelete({ userId })
            .then(() => {
              Users.findOneAndDelete({ _id: userId })
                .then(() => {
                  const message = "Verification token has expired.";
                  res.redirect(`/users/verified?status=error&message=${message}`);
                })
                .catch((err) => {
                  res.redirect(`/users/verified?status=error&message=`);
                });
            })
            .catch((error) => {
              console.log(error);
              res.redirect(`/users/verified?message=`);
            });
        } else {
          compareString(token, hashedToken)
            .then((isMatch) => {
              if (isMatch) {
                Users.findOneAndUpdate({ _id: userId }, { verified: true })
                  .then(() => {
                    Verification.findOneAndDelete({ userId }).then(() => {
                      const message = "Email verified successfully";
                      res.redirect(
                        `/users/verified?status=success&message=${message}`
                      );
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    const message = "Verification failed or link is invalid";
                    res.redirect(
                      `/users/verified?status=error&message=${message}`
                    );
                  });
              } else {
                // invalid token
                const message = "Verification failed or link is invalid";
                res.redirect(`/users/verified?status=error&message=${message}`);
              }
            })
            .catch((err) => {
              console.log(err);
              res.redirect(`/users/verified?message=`);
            });
        }
      } else {
        const message = "Invalid verification link. Try again later.";
        res.redirect(`/users/verified?status=error&message=${message}`);
      }
    } catch (error) {
      console.log(err);
      res.redirect(`/users/verified?message=`);
    }
  };

/**
 * Initiates a request to reset the password.
 * Retrieves the user by email, generates a password reset link, and sends it to the user's email.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @return void
 */
  export const requestPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await Users.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          status: "FAILED",
          message: "Email address not found.",
        });
      }
  
      const existingRequest = await PasswordReset.findOne({ email });
      if (existingRequest) {
        if (existingRequest.expiresAt > Date.now()) {
          return res.status(201).json({
            status: "PENDING",
            message: "Reset password link has already been sent to your email.",
          });
        }
        await PasswordReset.findOneAndDelete({ email });
      }
      await resetPasswordLink(user, res);
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  };

/**
 * Resets the user's password based on the provided reset token and user ID.
 * Checks the validity of the token and updates the user's password if the token is valid.
 * If the token is invalid or expired, redirects the user with an appropriate error message.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @return void
 */
  export const resetPassword = async (req, res) => {
    const { userId, token } = req.params;
  
    try {
      // find record
      const user = await Users.findById(userId);
  
      if (!user) {
        const message = "Invalid password reset link. Try again";
        res.redirect(`/users/resetpassword?status=error&message=${message}`);
      }
  
      const resetPassword = await PasswordReset.findOne({ userId });
  
      if (!resetPassword) {
        const message = "Invalid password reset link. Try again";
        return res.redirect(
          `/users/resetpassword?status=error&message=${message}`
        );
      }
  
      const { expiresAt, token: resetToken } = resetPassword;
  
      if (expiresAt < Date.now()) {
        const message = "Reset Password link has expired. Please try again";
        res.redirect(`/users/resetpassword?status=error&message=${message}`);
      } else {
        const isMatch = await compareString(token, resetToken);
  
        if (!isMatch) {
          const message = "Invalid reset password link. Please try again";
          res.redirect(`/users/resetpassword?status=error&message=${message}`);
        } else {
          res.redirect(`/users/resetpassword?type=reset&id=${userId}`);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  };

/**
 * Changes the user's password based on the provided user ID and new password.
 * Hashes the new password and updates the user's password in the database.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
  export const changePassword = async (req, res, next) => {
    try {
      const { userId, password } = req.body;
  
      const hashedpassword = await hashString(password);
  
      const user = await Users.findByIdAndUpdate(
        { _id: userId },
        { password: hashedpassword }
      );
  
      if (user) {
        await PasswordReset.findOneAndDelete({ userId });
  
        res.status(200).json({
          ok: true,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  };

/**
 * Retrieves user information based on the provided user ID.
 * Populates the user's friends and sends the user object as a response.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
  export const getUser = async (req, res, next) => {
    try {
      const { userId } = req.body.user;
      const { id } = req.params;
  
      const user = await Users.findById(id ?? userId).populate({
        path: "friends",
        select: "-password",
      });
  
      if (!user) {
        return res.status(200).send({
          message: "User Not Found",
          success: false,
        });
      }
  
      user.password = undefined;
  
      res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "auth error",
        success: false,
        error: error.message,
      });
    }
  };

/**
 * Updates user information based on the provided user ID and new data.
 * Validates the required fields and updates the user's information in the database.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
  export const updateUser = async (req, res, next) => {
    try {
      const { firstName, lastName, location, profileUrl, profession } = req.body;
  
      if (!(firstName || lastName || contact || profession || location)) {
        next("Please provide all required fields");
        return;
      }
  
      const { userId } = req.body.user;
  
      const updateUser = {
        firstName,
        lastName,
        location,
        profileUrl,
        profession,
        _id: userId,
      };
      const user = await Users.findByIdAndUpdate(userId, updateUser, {
        new: true,
      });
  
      await user.populate({ path: "friends", select: "-password" });
      const token = createJWT(user?._id);
  
      user.password = undefined;
  
      res.status(200).json({
        sucess: true,
        message: "User updated successfully",
        user,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  };

/**
 * Sends a friend request to another user based on the provided user ID and recipient ID.
 * Checks if a friend request has already been sent and sends the request accordingly.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
  export const friendRequest = async (req, res, next) => {
    try {
      const { userId } = req.body.user;
  
      const { requestTo } = req.body;
  
      const requestExist = await FriendRequest.findOne({
        requestFrom: userId,
        requestTo,
      });
  
      if (requestExist) {
        next("Friend Request already sent.");
        return;
      }
  
      const accountExist = await FriendRequest.findOne({
        requestFrom: requestTo,
        requestTo: userId,
      });
  
      if (accountExist) {
        next("Friend Request already sent.");
        return;
      }
  
      const newRes = await FriendRequest.create({
        requestTo,
        requestFrom: userId,
      });
  
      res.status(201).json({
        success: true,
        message: "Friend Request sent successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "auth error",
        success: false,
        error: error.message,
      });
    }
  };

/**
 * Retrieves pending friend requests for the specified user.
 * Finds friend requests where the user is the recipient and the request status is "Pending".
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @return void
 */
  export const getFriendRequest = async (req, res) => {
    try {
      const { userId } = req.body.user;
  
      const request = await FriendRequest.find({
        requestTo: userId,
        requestStatus: "Pending",
      })
        .populate({
          path: "requestFrom",
          select: "firstName lastName profileUrl profession -password",
        })
        .limit(10)
        .sort({
          _id: -1,
        });
  
      res.status(200).json({
        success: true,
        data: request,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "auth error",
        success: false,
        error: error.message,
      });
    }
  };

/**
 * Accepts or rejects a friend request based on the provided request ID and status.
 * Updates the friend request status accordingly and adds the sender as a friend if the status is "Accepted".
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
  export const acceptRequest = async (req, res, next) => {
    try {
      const id = req.body.user.userId;
  
      const { rid, status } = req.body;
  
      const requestExist = await FriendRequest.findById(rid);
  
      if (!requestExist) {
        next("No Friend Request Found.");
        return;
      }
  
      const newRes = await FriendRequest.findByIdAndUpdate(
        { _id: rid },
        { requestStatus: status }
      );
  
      if (status === "Accepted") {
        const user = await Users.findById(id);
  
        user.friends.push(newRes?.requestFrom);
  
        await user.save();
  
        const friend = await Users.findById(newRes?.requestFrom);
  
        friend.friends.push(newRes?.requestTo);
  
        await friend.save();
      }
  
      res.status(201).json({
        success: true,
        message: "Friend Request " + status,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "auth error",
        success: false,
        error: error.message,
      });
    }
  };

/**
 * Records a profile view for the specified user by another user.
 * Adds the viewing user's ID to the viewed user's profile views.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @param next the next function to pass control to the next middleware in the stack
 * @return void
 */
  export const profileViews = async (req, res, next) => {
    try {
      const { userId } = req.body.user;
      const { id } = req.body;
  
      const user = await Users.findById(id);
  
      user.views.push(userId);
  
      await user.save();
  
      res.status(201).json({
        success: true,
        message: "Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "auth error",
        success: false,
        error: error.message,
      });
    }
  };

/**
 * Retrieves a list of suggested friends for the specified user.
 * Finds users who are not the specified user and are not already friends with the user.
 *
 * @param req the Express.js request object
 * @param res the Express.js response object
 * @return void
 */
  export const suggestedFriends = async (req, res) => {
    try {
      const { userId } = req.body.user;
  
      let queryObject = {};
  
      queryObject._id = { $ne: userId };
  
      queryObject.friends = { $nin: userId };
  
      let queryResult = Users.find(queryObject)
        .limit(15)
        .select("firstName lastName profileUrl profession -password");
  
      const suggestedFriends = await queryResult;
  
      res.status(200).json({
        success: true,
        data: suggestedFriends,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  };