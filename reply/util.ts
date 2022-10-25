import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Reply, PopulatedReply} from '../reply/model';
import * as freetUtil from '../freet/util';
import { Freet } from 'freet/model';

type ReplyResponse = {
  _id: string;
  author: string;
  content: string;
  dateCreated: string;
  dateModified: string;
  anonymous: Boolean;
  deleted: Boolean;
  parentFreet: string;
  parentReply: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Reply object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reply>} reply - A reply
 * @returns {ReplyResponse} - The freet object formatted for the frontend
 */
const constructReplyResponse = (reply: HydratedDocument<Reply>): ReplyResponse => {
  const replyCopy: PopulatedReply = {
    ...reply.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  const {username} = replyCopy.authorId;
  delete replyCopy.authorId;
  return {
    ...replyCopy,
    _id: replyCopy._id.toString(),
    author: replyCopy.anonymous ? "Anonymous" : username,
    parentFreet: replyCopy.parentFreet ? replyCopy.parentFreet._id.toString() : undefined,
    parentReply: replyCopy.parentReply ? replyCopy.parentReply._id.toString() : undefined,
    dateCreated: formatDate(replyCopy.dateCreated),
    dateModified: formatDate(replyCopy.dateModified),
    anonymous: replyCopy.anonymous
  };
};

export {
    constructReplyResponse
};
