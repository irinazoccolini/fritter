import type {NextFunction, Request, Response} from 'express';
import * as userValidator from '../user/middleware';
import * as circleValidator from "../circle/middleware";
import express from 'express';
import CircleCollection from './collection';
import UserCollection from '../user/collection';
import { Types } from 'mongoose';
import FreetCollection from '../freet/collection';
import * as freetUtil from '../freet/util';
import * as util from "./util";
import ReplyCollection from '../reply/collection';

const router = express.Router();

/**
 * Get all the circles created by the current user (along with their auto-generated mutuals circle). 
 * 
 * @name GET /api/circles
 * @returns {CircleResponse[]} - an array of the user's circles
 * @throws {403} - if the user is not logged in 
 */
 router.get(
    '/',
    [
        userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
        const circles = await CircleCollection.findManyByCreatorId(req.session.userId as string);
        const circleResponses = circles.map(circle => util.constructCircleResponse(circle));
        res.status(200).json({
            message: "Circles that you own.",
            circles: circleResponses
        });
    }
);

/**
 * Modify the name or members of the circle.
 * 
 * @name PATCH /api/circles/:id
 * @param {string[]} members - the updated circle members
 * @param {string} name - updated circle name
 * @returns {CircleResponse} - the updated circle
 * @throws {403} - if the user is not logged in or if the user is not the owner of the circle
 * @throws {404} - if the circle id does not exist
 * @throws {400} - if a circle member username is invalid or if the circle name is empty
 * @throws {413} - if the circle name is too long
 * @throws {409} - if a circle with the updated name already exists
 */
router.patch(
    '/:circleId?',
    [
        userValidator.isUserLoggedIn,
        circleValidator.isCircleExists,
        circleValidator.isCircleOwner
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.body.name) next(); // editing the name
        else next('route'); // editing the members
    },
    [
        circleValidator.isValidCircleName,
        circleValidator.isCircleNotExists
    ],
    async (req: Request, res: Response) => {
        const updatedCircle = await CircleCollection.updateName(req.params.circleId, req.body.name);
        res.status(200).json({
            message: 'Your circle was updated successfully.',
            circle: util.constructCircleResponse(updatedCircle)
          });
    }

)
router.patch(
    '/:circleId?',
    [
        userValidator.isUsersExist
    ],
    async (req: Request, res: Response) => {
        const usernames = req.body.usernames.split(",");
        const userIds: Types.ObjectId[] = [];
        for (const username of usernames){
            userIds.push((await UserCollection.findOneByUsername(username))._id)
        }
        const updatedCircle = await CircleCollection.updateMembers(req.params.circleId, userIds);
        res.status(200).json({
            message: 'Your circle was updated successfully.',
            circle: util.constructCircleResponse(updatedCircle)
          });
    }
)

/**
 * Create a circle.
 * 
 * @name POST /api/circles
 * 
 * @param {string} name - the name of the circle
 * @param {string[]} usernames - the usernames of the users to be added to the circle
 * @return {CircleResponse} - the newly created circle
 * @throws {403} - if the user is not logged in 
 * @throws {409} - if a circle with the given name already exists
 * @throws {400} - if any of the usernames given for the members don't exist or if the circle name is empty
 * @throws {413} - if the circle name is too long
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        circleValidator.isCircleNotExists,
        userValidator.isUsersExist,
        circleValidator.isValidCircleName
    ],
    async (req: Request, res: Response) => {
        const usernames = req.body.usernames.split(",");
        const userIds: Types.ObjectId[] = [];
        for (const username of usernames){
            userIds.push((await UserCollection.findOneByUsername(username))._id)
        }
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const circle = await CircleCollection.addOne(userId, req.body.name, userIds);
        
        res.status(201).json({
            message: 'Your circle was created successfully.',
            circle: util.constructCircleResponse(circle)
          });
    }
);

/**
 * Delete a circle
 * 
 * @name DELETE /api/circles/:circleId
 * @returns {string} - a success message
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the circle id given does not exist
 * @throws {400} - if the user is trying to delete their auto-generated mutuals circle 
 */
router.delete(
    '/:circleId?',
    [
        userValidator.isUserLoggedIn,
        circleValidator.isCircleExists,
        circleValidator.isCircleDeletable,
        circleValidator.isCircleCreator
    ],
    async (req: Request, res: Response) => {
        await CircleCollection.deleteOne(req.params.circleId);
        await FreetCollection.privateManyByCircle(req.params.circleId); // delete all the freets that were posted to this circle
        await ReplyCollection.privateManyByCircle(req.params.circleId);
        res.status(200).json({
            message: "Your circle was successfully deleted."
        });
    }
);

/**
 * Get the details for a circle
 * 
 * @name GET /api/circles/:circleId
 * @returns {CircleResponse} - requested circle
 * @throws {403} - if the user is not logged in or the user isn't the circle creator
 * @throws {404} - if the circle doesn't exist
 */
router.get(
    '/:circleId?',
    [
        userValidator.isUserLoggedIn,
        circleValidator.isCircleExists,
        circleValidator.isCircleCreator
    ],
    async (req: Request, res: Response) => { 
        const circle = await CircleCollection.findOneById(req.params.circleId);
        res.status(200).json({
            message: "The details for the circle.",
            circle: util.constructCircleResponse(circle)
        });
    }
);


/**
 * Get all the freets posted to a circle.
 * 
 * @name GET /api/circles/:circleId/freets
 * 
 * @returns {FreetResponse[]}
 */
router.get(
    '/:circleId?/freets',
    [
        userValidator.isUserLoggedIn,
        circleValidator.isCircleExists,
        circleValidator.isValidCircleViewer
    ],
    async (req: Request, res: Response) => {
        const freets = await FreetCollection.findManyByCircle(req.params.circleId);
        const responseFreets = freets.map(freetUtil.constructFreetResponse);
        res.status(200).json({
            message: "Freets in the circle.",
            freets: responseFreets
        });
    }
);

export {router as circleRouter};