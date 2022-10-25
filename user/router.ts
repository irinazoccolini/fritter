import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import FollowCollection from '../follow/collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Sign in user.
 *
 * @name POST /api/users/session
 *
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
 *
 */
router.post(
  '/session',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isValidPassword,
    userValidator.isAccountExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsernameAndPassword(
      req.body.username, req.body.password
    );
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: 'You have logged in successfully',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Sign out a user
 *
 * @name DELETE /api/users/session
 *
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  '/session',
  [
    userValidator.isUserLoggedIn
  ],
  (req: Request, res: Response) => {
    req.session.userId = undefined;
    res.status(200).json({
      message: 'You have been logged out successfully.'
    });
  }
);

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(req.body.username, req.body.password);
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PUT /api/users
 *
 * @param {string} username - The user's new username
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await UserCollection.deleteOne(userId);
    await FreetCollection.deleteManyByAuthor(userId);
    req.session.userId = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    });
  }
);

/**
 * Follow a user.
 * 
 * @name POST /api/users/:username/followers
 * 
 * @return {Follow} - the newly created follow
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the given user id doesn't exist
 */
router.post(
  '/:username?/followers',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUsernameInParamsExists,
    followValidator.isFollowNotExists,
    followValidator.isFollowable
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.username as string);
    const follow = await FollowCollection.addFollow(req.session.userId, user._id.toString());
    res.status(200).json({
      message: "Your follow has been added successfully.",
      follow: follow
    });
  }
);

/**
 * Unfollow a user
 * 
 * @name DELETE /api/users/:username/followers
 * 
 * @return {string} - a sucess message
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the given user id doesn't exist
 */
router.delete(
  '/:username?/followers',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUsernameInParamsExists,
    followValidator.isFollowExists
  ],
  async(req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.username as string);
    await FollowCollection.deleteFollow(req.session.userId, user._id.toString());
    res.status(200).json({
      message: "Your follow was deleted successfully."
    });
  }
);

/**
 * Get all of a user's followers
 * 
 * @name GET /api/users/:username/followers
 * 
 * @return {Follow[]} - an array of the followers
 * @throws {403} - if the user is not logged in
 */
router.get(
  '/:username?/followers',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.username as string);
    console.log(req.params.username);
    console.log(user);
    console.log(user._id);
    const followers = await FollowCollection.findByFollowee(user._id.toString());
    res.status(200).json({
      message: `Followers for user ${req.params.username} returned successfully.`,
      followers: followers
    });
  }
);

/**
 * Get all the users that a user is following
 * 
 * @name GET /api/users/:username/following
 * 
 * @return {Follow[]} - an array of who the user follows
 * @throws {403} - if the user is not logged in
 */
router.get(
  '/:username?/following',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.username as string);
    const following = await FollowCollection.findByFollower(user._id.toString());
    res.status(200).json({
      message: `The users that user ${req.params.username} is following returned successfully.`,
      followers: following
    });
  }
);

export {router as userRouter};
