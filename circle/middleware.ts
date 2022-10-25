import CircleCollection from "./collection";
import type {Request, Response, NextFunction} from 'express';
import { Types } from "mongoose";

/**
 * Check if a circle with name in req.body doesn't exist for the current user.
 */
const isCircleNotExists = async (req: Request, res: Response, next: NextFunction) => {
    const circle = await CircleCollection.findOneByNameAndUser(req.body.name, req.session.userId);
    if (circle){
        res.status(409).json({
            error: {
              circleAlreadyExists: `A circle with the name ${req.body.name} already exists for you.` 
            }
          });
        return;
    }
    next();
};

/**
 * Check if a circle with id in req.params exists.
 */
const isCircleExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.circleId);
    const circle = validFormat ? await CircleCollection.findOneById(req.params.circleId) : '';
    if (!circle){
        res.status(404).json({
            error: {
                circleDoesNotExist: `A circle with id ${req.params.circleId as string} does not exist.`
            }
        });
        return;
    }
    next();
};

/**
 * Check that the circle with id in req.params is deletable (is not the auto-generated mutuals circle)
 */
const isCircleDeletable = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.circleId);
    const circle = validFormat ? await CircleCollection.findOneById(req.params.circleId) : '';
    if (!circle || !circle.deletable){
        res.status(400).json({
            error: {
                circleNotDeletable: `The mutuals auto-generated circle cannot be deleted.`
            }
        })
        return;
    }
    next();
};

/**
 * Checks if the current user is the creator of the circle whose circleId is in req.params
 */
const isCircleCreator = async (req: Request, res: Response, next: NextFunction) => {
    const circle = await CircleCollection.findOneById(req.params.circleId);
    const userId = circle.creatorId._id;
    if (req.session.userId !== userId.toString()) {
        res.status(403).json({
            error: 'Cannot modify other users\' circles.'
        });
        return;
    }

    next();
};

/**
 * Check if the current user is able to see this circle (either a member of the creator of the circle).
 */
const isValidCircleViewer = async (req: Request, res: Response, next: NextFunction) => {
    const circle = await CircleCollection.findOneById(req.params.circleId);
    const circleMemberIds = new Set(circle.members.map(member => member._id.toString()));
    const circleCreatorId = circle.creatorId._id.toString();
    if (req.session.userId !== circleCreatorId && !circleMemberIds.has(req.session.userId)){
        res.status(403).json({
            error: "You can't see freets in a circle that you're not part of."
        });
        return;
    }
    next();
};

/**
 * Check if the current user is the owner of the circle in req.params
 */
const isCircleOwner = async (req: Request, res: Response, next: NextFunction) => {
        const circle = await CircleCollection.findOneById(req.params.circleId);
        const userId = circle.creatorId._id;
        if (req.session.userId !== userId.toString()) {
            res.status(403).json({
                error: "Can't edit other users' circles."
            });
            return;
        }

    next();
}

/**
 * Check if the current user is the owner of the circle in req.body
 */
const isCircleInBodyOwner = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.circleId){
        const circle = await CircleCollection.findOneById(req.body.circleId);
        const userId = circle.creatorId._id;
        if (req.session.userId !== userId.toString()) {
            res.status(403).json({
                error: "Can't post freets to other users' circles."
            });
            return;
        }
    }
    next();
};

/**
 * Check if the circle in req.body exists
 */
const isCircleInBodyExists = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.circleId){
        const validFormat = Types.ObjectId.isValid(req.body.circleId);
        const circle = validFormat ? await CircleCollection.findOneById(req.body.circleId) : '';
        if (!circle){
            res.status(400).json({
                error: {
                    circleDoesNotExist: `A circle with id ${req.body.circleId as string} does not exist.`
                }
            });
            return;
        }
    }
    next();
};

/**
 * Checks if the circle name in req.body is a valid name
 */
const isValidCircleName = async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name
    if (!name.trim()){
        res.status(400).json({
            error: 'Circle name must be at least one character long.'
        });
        return;
    };

    if (name.length > 50){
        res.status(413).json({
            error: 'Circle name must be no more than 50 characters.'
        });
        return;
    };
    next();
}

export {
    isCircleNotExists,
    isCircleDeletable,
    isCircleExists,
    isCircleCreator,
    isValidCircleViewer,
    isCircleInBodyExists,
    isCircleInBodyOwner,
    isCircleOwner,
    isValidCircleName
}
