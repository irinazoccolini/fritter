import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../like/collection';

/**
 * Checks if a like with freetId and userId doesn't exist yet.
 */
const isLikeNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const like = validFormat ? await LikeCollection.findOneByFreetAndLiker(req.session.userId, req.body.freetId) : '';
  if (like.length !== 0) {
    res.status(409).json({
      error: {
        likeExists: `User with ID ${req.session.userId} has already liked freet with ID ${req.body.freetId}.`
      }
    });
    return;
  }
  next();
};

/**
 * Checks if a like for freetId and userId exists.
 */
 const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const like = validFormat ? await LikeCollection.findOneByFreetAndLiker(req.session.userId, req.body.freetId) : '';
  if (like.length == 0) {
    res.status(404).json({
      error: {
        likeNotExists: `A like for freet ${req.body.freetId} from user ${req.session.userId} does not exist.`
      }
    });
    return;
  }
  next();
};

export {
    isLikeNotExists,
    isLikeExists
  };
  