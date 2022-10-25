import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReplyCollection from './collection';
import CircleCollection from '../circle/collection';

/**
 * Checks if a reply with replyId in req.params exists
 */
const isReplyExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.replyId as string);
  const reply = validFormat ? await ReplyCollection.findOneById(req.params.replyId as string) : '';
  if (!reply) {
    res.status(404).json({
      error: {
        replyNotFound: `Reply with reply ID ${req.params.replyId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the reply whose replyId is in req.params
 */
 const isValidReplyModifier = async (req: Request, res: Response, next: NextFunction) => {
  const reply = await ReplyCollection.findOneById(req.params.replyId);
  const userId = reply.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify or delete other users\' replies.'
    });
    return;
  }

  next();
};


/**
 * Checks if a reply with replyId in req.query exists
 */
 const isReplyExistsInQuery = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.replyId) {
    res.status(400).json({
      error: 'Provided reply ID must be nonempty.'
    });
    return;
  }
  const validFormat = Types.ObjectId.isValid(req.query.replyId as string);
  const reply = validFormat ? await ReplyCollection.findOneById(req.query.replyId as string) : '';
  if (!reply) {
    res.status(404).json({
      error: {
        replyNotFound: `Reply with reply ID ${req.query.replyId} does not exist.`
      }
    });
    return;
  }

  next();
};


/**
 * Checks if the content of the reply in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
 const isValidReplyContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Reply content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Reply content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Check that a user can view the freet.
 */
 const isValidReplyViewer = async (req: Request, res: Response, next: NextFunction) => {
  const reply = await ReplyCollection.findOneById(req.params.replyId);
  const authorId = reply.authorId._id.toString();
  const circle = reply.circle ? (await CircleCollection.findOneById(reply.circle._id)) : undefined
  const circleMembers = circle ? circle.members : []
  const circleMemberIds = new Set(circleMembers.map(member => member._id.toString()));
  const circleOwner = circle ? circle.creatorId._id : undefined;
  if ((reply.private && req.session.userId !== authorId) || 
      (reply.circle && ((!circleMemberIds.has(req.session.userId)) && circleOwner.toString() !== req.session.userId))) {
    res.status(403).json({
      error: "You do not have access to view this freet."
    });
    return;
  }
  next();
}
  

export {
    isReplyExists,
    isValidReplyModifier,
    isReplyExistsInQuery,
    isValidReplyContent,
    isValidReplyViewer
};
