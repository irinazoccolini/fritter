import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from "../like/middleware";
import * as reportValidator from "../report/middleware";
import * as circleValidator from "../circle/middleware";
import * as replyValidator from "../reply/middleware";
import * as util from './util';
import * as replyUtil from '../reply/util';
import * as likeUtil from '../like/util';
import * as reportUtil from '../report/util';
import ReplyCollection from '../reply/collection';
import LikeCollection from '../like/collection';
import ReportCollection from '../report/collection';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?authorId=id
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAll();
    const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    const response = authorFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @param {string} anonymous - Whether the freet is posted anonymously
 * @param {string} circleId - The id of the circle that the freet is posted to, if any
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent,
    circleValidator.isCircleInBodyExists,
    circleValidator.isCircleInBodyOwner
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content, req.body.anonymous, req.body.circleId);
    res.status(201).json({
      message: 'Your freet was created successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Modify a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  '/:freetId?',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.content) next();
    else next('route');
  },
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Delete a freet
 * 
 * @name PATCH /api/freets/:id
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 */
router.patch(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    });
  }
);

/**
 * Get all replies to a freet
 * 
 * @name GET /api/freets/:id/replies
 * 
 * @return {ReplyResponse[]} - a list of all the replies to the freet
 * @throws {404} - If the freetId is not valid
 * @throws {403} - If the user is not logged in
 */
router.get(
  "/:freetId?/replies",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response) => {
    const replies = await ReplyCollection.findAllByParentFreet(req.params.freetId);
    const response = replies.map(replyUtil.constructReplyResponse);
    res.status(200).json(response);
  }
)

/**
 * Post a reply to a freet
 * 
 * @name POST /api/freets/:id/replies
 * 
 * @param {string} content - the content of the reply
 * @param {boolean} anonymous - whether the reply is anonymous
 * 
 * @return {ReplyResponse} - the newly created reply
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.post(
  "/:freetId?/replies",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    replyValidator.isValidReplyContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const reply = await ReplyCollection.addReplyToFreet(userId, req.params.freetId, req.body.anonymous, req.body.content);

    res.status(201).json({
      message: 'Your reply was created successfully.',
      reply: replyUtil.constructReplyResponse(reply)
    });
  }
)

/**
 * Like a freet
 * 
 * @name POST /api/freets/:id/likes
 * 
 * @return {Like} - the newly created like
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet doesn't exist
 * @throws {409} - the like already exists
 */
router.post(
  '/:freetId?/likes',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.isFreetLikeNotExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const like = await LikeCollection.addFreetLike(userId, req.params.freetId);
    res.status(201).json({
        message: 'Your like was added successfully.',
        like: likeUtil.constructLikeResponse(like)
      });
  }
);

/**
 * Unlike a freet
 * 
 * @name DELETE /api/freets/:id/likes
 * 
 * @return {string} - a success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet doesn't exists or if the user hasn't like the freet previously
 */
router.delete(
  '/:freetId?/likes',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.isFreetLikeExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const like = await LikeCollection.deleteFreetLike(userId, req.params.freetId);
    res.status(201).json({
        message: 'Your like was deleted successfully.'
      });
  }
);

/**
 * Get all likes for a freet
 * 
 * @name GET /api/freets/:id/likes
 * 
 * @return {Like[]} - an array of likes for the freet
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the freet doesn't exists
 */
router.get(
  '/:freetId?/likes',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const freetLikes = await LikeCollection.findAllByFreet(req.params.freetId as string);
    const freetLikesResponse = freetLikes.map(like => likeUtil.constructLikeResponse(like));
      res.status(200).json({
      message: `Freet ${req.params.freetId} has ${freetLikes.length} likes.`,
      likes: freetLikesResponse
    });
  }
);

/**
 * Get all reports for a freet
 * 
 * @name GET /api/freets/:id/reports
 * 
 * @return {Report[]} - an array of reports for the freet
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the freet doesn't exists
 */
 router.get(
  '/:freetId?/reports',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const freetReports = await ReportCollection.findAllByFreet(req.params.freetId as string);
    const freetReportsResponse = freetReports.map(report => reportUtil.constructReportResponse(report));
      res.status(200).json({
      message: `Freet ${req.params.freetId} has ${freetReports.length} reports.`,
      reports: freetReportsResponse
    });
  }
);

/**
 * Report a freet
 * 
 * @name POST /api/freets/:id/reports
 * 
 * @return {Report} - the newly created report
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the freet doesn't exist
 * @throws {409} - if the report already exists
 */
router.post(
  '/:freetId?/reports',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    reportValidator.isReplyReportNotExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const report = await ReportCollection.addFreetReport(userId, req.params.freetId);
    const allReports = await ReportCollection.findAllByFreet(req.params.freetId);
    if (allReports.length >= 10){
      await FreetCollection.deleteOne(req.params.freetId);
    }
    res.status(201).json({
        message: 'Your report was added successfully.',
        report: reportUtil.constructReportResponse(report)
      });
  }
);

export {router as freetRouter};