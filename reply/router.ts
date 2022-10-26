import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as replyValidator from "../reply/middleware";
import * as likeValidator from "../like/middleware";
import * as reportValidator from "../report/middleware";
import ReplyCollection from '../reply/collection';
import LikeCollection from '../like/collection';
import ReportCollection from '../report/collection';
import CircleCollection from '../circle/collection';
import UserCollection from '../user/collection';
import * as util from './util';
import * as likeUtil from '../like/util';
import * as reportUtil from '../report/util';
import { Types } from 'mongoose';

const router = express.Router();
/**
 * Get all the replies by author
 * 
 * @name GET /api/replies?authorId=id
 * @return {ReplyResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 */
router.get(
    "/",
    [
        userValidator.isAuthorExists
    ],
    async (req: Request, res: Response) => {
        // return everything if the user is looking for their own replies
        const author = await UserCollection.findOneByUsername(req.query.author as string);
        if (author._id.toString() === req.session.userId) {
          const authorReplies = await ReplyCollection.findAllByAuthor(author._id.toString());
          const response = authorReplies.map(util.constructReplyResponse);
          res.status(200).json(response);
        }
        else {
          const authorCircles = await CircleCollection.findManyByCreatorId(author._id);
          const overlappingCircleIds: Types.ObjectId[] = []
          for (const circle of authorCircles) {
            const circleMembersIds = new Set(circle.members.map(member => member._id.toString()));
            if (circleMembersIds.has(req.session.userId)) {
              overlappingCircleIds.push(circle._id)
            }
          }
          const visibleReplies = await ReplyCollection.findVisibleReplies(overlappingCircleIds);
          const response = visibleReplies.map(util.constructReplyResponse);
          res.status(200).json(response);
        }
      }
)
/**
 * Get all replies to a reply
 * 
 * @name GET /api/replies/:id/replies
 * 
 * @return {ReplyResponse[]} - a list of all the replies to the freet
 * @throws {404} - If the replyId is not valid
 * @throws {403} - If the user is not logged in
 */
 router.get(
    "/:replyId?/replies",
    [
      userValidator.isUserLoggedIn,
      replyValidator.isReplyExists,
      replyValidator.isValidReplyViewer,
    ],
    async (req: Request, res: Response) => {
      const replies = await ReplyCollection.findAllByParentReply(req.params.replyId);
      const response = replies.map(util.constructReplyResponse);
      res.status(200).json(response);
    }
)

/**
 * Get a reply from its id
 * 
 * @name GET /api/replies/:id
 * 
 * @return {ReplyResponse} - the reply
 * @throws {404} - if the reply id is not valid
 * @throws {403} - if the user is not logged in or if the user can't access the reply
 */
router.get(
    "/:replyId?",
    [
        userValidator.isUserLoggedIn,
        replyValidator.isReplyExists,
        replyValidator.isValidReplyViewer
    ],
    async (req: Request, res: Response) => {
        const reply = await ReplyCollection.findOneById(req.params.replyId);
        res.status(200).json({
            message: "Reply retrieved successfully",
            reply: util.constructReplyResponse(reply)
        });
    }
);

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
        replyValidator.isValidReplyViewer,
        replyValidator.isValidReplyContent
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const reply = await ReplyCollection.findOneById(req.params.replyId);
        const circle = reply.circle ? await CircleCollection.findOneById(reply.circle._id) : undefined;
        if (circle) {
          const reply = await ReplyCollection.addReplyToReply(userId, req.params.replyId, req.body.anonymous, req.body.content, circle._id);
          res.status(201).json({
            message: 'Your reply was created successfully.',
            reply: util.constructReplyResponse(reply)
          });
        } else {
          const reply = await ReplyCollection.addReplyToReply(userId, req.params.replyId, req.body.anonymous, req.body.content, undefined);
    
          res.status(201).json({
            message: 'Your reply was created successfully.',
            reply: util.constructReplyResponse(reply)
          });
        }
    
    }
)


/**
 * Modify a reply
 *
 * @name PATCH /api/replies/:id
 *
 * @param {string} content - the new content for the reply
 * @return {ReplyResponse} - the updated reply
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the reply
 * @throws {404} - If the replyId is not valid
 */
router.patch(
    '/:replyId?',
    [
        userValidator.isUserLoggedIn,
        replyValidator.isReplyExists,
        replyValidator.isValidReplyModifier,
        replyValidator.isValidReplyContent
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
        await LikeCollection.deleteManyByReply(req.params.replyId);
        await ReportCollection.deleteManyByReply(req.params.replyId);
        res.status(200).json({
            message: 'Your reply was deleted successfully.'
        });
    }
)


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
        replyValidator.isValidReplyViewer,
        likeValidator.isReplyLikeNotExists
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const like = await LikeCollection.addReplyLike(userId, req.params.replyId);
        res.status(201).json({
            message: 'Your like was added successfully.',
            like: likeUtil.constructLikeResponse(like)
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
        replyValidator.isValidReplyViewer,
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
        replyValidator.isReplyExists,
        replyValidator.isValidReplyViewer
    ],
    async (req: Request, res: Response) => {
        const replyLikes = await LikeCollection.findAllByReply(req.params.replyId as string);
        const replyLikesReponse = replyLikes.map(like => likeUtil.constructLikeResponse(like));
        res.status(200).json({
            message: `Reply ${req.params.replyId} has ${replyLikes.length} likes.`,
            likes: replyLikesReponse
        });
    }
)

/**
 * Get all reports for a reply
 * 
 * @name GET /api/replies/:id/reports
 * 
 * @return {Report[]} - an array of reports for the reply
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the reply doesn't exists
 */
router.get(
    '/:replyId?/reports',
    [
      userValidator.isUserLoggedIn,
      replyValidator.isReplyExists,
      replyValidator.isValidReplyViewer,
    ],
    async (req: Request, res: Response) => {
      const replyReports = await ReportCollection.findAllByReply(req.params.replyId as string);
      const replyReportsResponse = replyReports.map(report => reportUtil.constructReportResponse(report));
        res.status(200).json({
        message: `Reply ${req.params.replyId} has ${replyReports.length} reports.`,
        reports: replyReportsResponse
      });
    }
);
  
/**
 * Report a reply
 * 
 * @name POST /api/replies/:id/reports
 * 
 * @return {Report} - the newly created report
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the reply doesn't exist
 * @throws {409} - if the report already exists
 */
router.post(
    '/:replyId?/reports',
    [
        userValidator.isUserLoggedIn,
        replyValidator.isReplyExists,
        replyValidator.isValidReplyViewer,
        reportValidator.isReplyReportNotExists
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const report = await ReportCollection.addReplyReport(userId, req.params.replyId);
        const allReports = await ReportCollection.findAllByReply(req.params.replyId);
        if (allReports.length >= 10){
            await ReplyCollection.deleteOne(req.params.replyId);
        }
        res.status(201).json({
            message: 'Your report was added successfully.',
            report: reportUtil.constructReportResponse(report)
        });
    }
);

export {router as replyRouter}