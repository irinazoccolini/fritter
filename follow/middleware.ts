import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FollowCollection from './collection';
import UserCollection from '../user/collection';

/**
 * Checks if a follow with followee id in req.params and follower id in req.session doesn't exist yet.
 */
const isFollowNotExists = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUsername(req.params.username as string);
    const follow = await FollowCollection.findOneByFollowerAndFollowee(req.session.userId, user._id.toString());
    if (follow) {
        res.status(409).json({
        error: {
            followExists: `You are already following user ${req.params.username}.`
        }
        });
        return;
    }
    next();
};

/**
 * Checks if a follow with followee id in req.params and follower id in req.session exists.
 */
const isFollowExists = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUsername(req.params.username as string);
    const follow = await FollowCollection.findOneByFollowerAndFollowee(req.session.userId, user._id.toString());
    if (!follow) {
        res.status(404).json({
        error: {
            followNotExists: `You are not following user ${req.params.username}.`
        }
        });
        return;
    }
    next();
};

/**
 * Checks if a user can be followed by the current user. 
 */
const isFollowable = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUsername(req.params.username as string);
    if (req.session.userId === user._id.toString()){
        res.status(400).json({
            error: {
                cannotFollowYourself: "You cannot follow your own account."
            }
        });
        return;
    }
    next();
};

export{
    isFollowExists,
    isFollowNotExists,
    isFollowable
}