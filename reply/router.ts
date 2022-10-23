import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as replyValidator from "../reply/middleware";
import * as likeValidator from "../like/middleware";
import ReplyCollection from '../reply/collection';
import LikeCollection from '../like/collection';
import * as util from './util';

const router = express.Router();

/**
 * Get all replies to a reply
 * 
 * @name GET /api/replies/:id/replies
 * 
 * @return {ReplyResponse[]} - a list of all the replies to the freet
 * @throws {404} - If the freetId is not valid
 * @throws {403} - If the user is not logged in
 */
 router.get(
    "/:replyId?/replies",
    [
      userValidator.isUserLoggedIn,
      replyValidator.isReplyExists,
    ],
    async (req: Request, res: Response) => {
      const replies = await ReplyCollection.findAllByParentReply(req.params.replyId);
      const response = replies.map(util.constructReplyResponse);
      res.status(200).json(response);
    }
  )
  
/**
 * Post a reply to a reply
 * 
 * @name POST /api/replies/:id/replies
 * 
 * @param {string} content - the content of the reply
 * @param {boolean} anonymous - whether the reply is anonymous
 * 
 * @return {ReplyResponse} - the newly created reply
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.post(
    "/:replyId?/replies",
    [
        userValidator.isUserLoggedIn,
        replyValidator.isReplyExists,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const reply = await ReplyCollection.addReplyToReply(userId, req.params.replyId, req.body.anonymous, req.body.content);

        res.status(201).json({
        message: 'Your reply was created successfully.',
        reply: util.constructReplyResponse(reply)
        });
    }
)

/**
 * Delete a reply
 *
 * @name DELETE /api/replies/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the reply
 * @throws {404} - If the replyId is not valid
 */
router.delete(
    '/:replyId?',
    [
        userValidator.isUserLoggedIn,
        replyValidator.isReplyExists,
        replyValidator.isValidReplyModifier
    ],
    async (req: Request, res: Response) => {
        await ReplyCollection.deleteOne(req.params.replyId);
        res.status(200).json({
        message: 'Your reply was deleted successfully.'
        });
    }
);

/**
 * Modify a reply
 *
 * @name PUT /api/replies/:id
 *
 * @param {string} content - the new content for the reply
 * @return {ReplyResponse} - the updated reply
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the reply
 * @throws {404} - If the replyId is not valid
 */
router.put(
    '/:replyId?',
    [
        userValidator.isUserLoggedIn,
        replyValidator.isReplyExists,
        replyValidator.isValidReplyModifier
    ],
    async (req: Request, res: Response) => {
        const reply = await ReplyCollection.updateOne(req.params.replyId, req.body.content);
        res.status(200).json({
        message: 'Your reply was updated successfully.',
        reply: util.constructReplyResponse(reply)
        });
    }
);


/**
 * Like a reply.
 * 
 * @name POST /api/replies/:id/likes
 * 
 * @return {Like} - the newly created like
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the reply doesn't exist
 * @throws {409} - the like already exists
 */
router.post(
    '/:replyId?/likes',
    [
        userValidator.isUserLoggedIn,
        replyValidator.isReplyExists,
        likeValidator.isReplyLikeNotExists
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const like = await LikeCollection.addReplyLike(userId, req.params.replyId);
        res.status(201).json({
            message: 'Your like was added successfully.',
            like: like
        });
    }
);

/**
 * Unlike a reply
 * 
 * @name DELETE /api/replies/:id/likes
 * 
 * @return {string} - a success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the reply doesn't exists or if the user hasn't liked the reply previously
 */
router.delete(
    '/:replyId?/likes',
    [
        userValidator.isUserLoggedIn,
        replyValidator.isReplyExists,
        likeValidator.isReplyLikeExists
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const like = await LikeCollection.deleteReplyLike(userId, req.params.replyId);
        res.status(201).json({
            message: 'Your like was deleted successfully.'
        });
    }
)

/**
 * Get all likes for a reply
 * 
 * @name GET /api/replies/:id/likes
 * 
 * @return {Like[]} - an array of likes for the reply
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the reply doesn't exists
 */
router.get(
    '/:replyId?/likes',
    [
        userValidator.isUserLoggedIn,
        replyValidator.isReplyExists
    ],
    async (req: Request, res: Response) => {
        const replyLikes = await LikeCollection.findAllByReply(req.params.replyId as string);
        res.status(200).json({
        message: `Reply ${req.params.replyId} has ${replyLikes.length} likes.`,
        likes: replyLikes
        });
    }
)

export {router as replyRouter}