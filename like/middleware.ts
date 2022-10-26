import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../like/collection';

/**
 * Checks if a like with freetId and userId doesn't exist yet.
 */
const isFreetLikeNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const like = validFormat ? await LikeCollection.findOneByFreetAndLiker(req.session.userId, req.params.freetId) : '';
  if (like) {
    res.status(409).json({
      error: {
        likeExists: `User with ID ${req.session.userId} has already liked freet with ID ${req.params.freetId}.`
      }
    });
    return;
  }
  next();
};

/**
 * Checks if a like for freetId and userId exists.
 */
 const isFreetLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const like = validFormat ? await LikeCollection.findOneByFreetAndLiker(req.session.userId, req.params.freetId) : '';
  if (!like) {
    res.status(404).json({
      error: {
        likeNotExists: `A like for freet ${req.params.freetId} from user ${req.session.userId} does not exist.`
      }
    });
    return;
  }
  next();
};

/**
 * Checks if a like with replyId and userId doesn't exist yet.
 */
 const isReplyLikeNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.replyId);
  const like = validFormat ? await LikeCollection.findOneByReplyAndLiker(req.session.userId, req.params.replyId) : '';
  if (like) {
    res.status(409).json({
      error: {
        likeExists: `User with ID ${req.session.userId} has already liked reply with ID ${req.params.replyId}.`
      }
    });
    return;
  }
  next();
};

/**
 * Checks if a like for replyId and userId exists.
 */
 const isReplyLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.replyId);
  const like = validFormat ? await LikeCollection.findOneByReplyAndLiker(req.session.userId, req.params.replyId) : '';
  if (!like) {
    res.status(404).json({
      error: {
        likeNotExists: `A like for reply ${req.params.replyId} from user ${req.session.userId} does not exist.`
      }
    });
    return;
  }
  next();
};


export {
    isFreetLikeNotExists,
    isFreetLikeExists,
    isReplyLikeExists,
    isReplyLikeNotExists
  };
  