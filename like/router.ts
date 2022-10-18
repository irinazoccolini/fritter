import express from "express";
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';
import LikeCollection from "./collection";
import type {NextFunction, Request, Response} from 'express';
const router = express.Router()

/** 
 * Get number of likes for a freet.
 * 
 * @name GET /api/likes?freetId=id
 * 
 * @return {integer} - Number of likes for the given freet
 * @throws {403} - the user is not logged in
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has the given freetId
 */
router.get(
    '/',
      [
        userValidator.isUserLoggedIn,
        freetValidator.isFreetExistsQuery
      ],
      async (req: Request, res: Response) => {
        const freetLikes = await LikeCollection.findAllByFreet(req.query.freetId as string);
        res.status(200).json({
            message: `Freet ${req.query.freetId} has ${freetLikes.length} likes.`,
            likeCount: freetLikes.length
        });
      }
    );

/**
 * Like an item
 * 
 * @name POST /api/likes
 * 
 * @return {string} - a success message
 * @throws {403} - the user is not logged in
 * @throws {404} - the freet id is invalid
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        likeValidator.isLikeNotExists,
        freetValidator.isFreetExistsBody
    ],
    async (req:Request, res:Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const like = await LikeCollection.addOne(userId, req.body.freetId);
        res.status(201).json({
            message: 'Your like was added successfully.'
          });
    }
)

/**
 * Unlike a freet
 * 
 * @name DELETE /api/likes
 * 
 * @return {string} - a success message
 * @throws {403} - the user is not logged in
 * @throws {404} - the like is invalid
 */
 router.delete(
    '/',
    [
        userValidator.isUserLoggedIn,
        likeValidator.isLikeExists,
        freetValidator.isFreetExistsBody
    ],
    async (req:Request, res:Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const like = await LikeCollection.deleteOne(userId, req.body.freetId);
        res.status(201).json({
            message: 'Your like was deleted successfully.',
            like: like,
          });
    }
)

export {router as likeRouter};