import type {Like, PopulatedLike} from './model';
import {HydratedDocument} from 'mongoose';
type LikeResponse = {
    _id: string,
    freetId: string,
    replyId: string,
    likerUsername: string
}

/**
 * Transform a raw like object to a formatted object with all the information needed on the frontend
 * 
 * @param {HydratedDocument<Like>} like - the like object
 * @return {LikeResponse} - the formatted response
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
    const likeCopy: PopulatedLike = {
        ...like.toObject({
          versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    const {username} = likeCopy.likerId;
    delete likeCopy.likerId;
    return {
        ...likeCopy,
        _id: likeCopy._id.toString(),
        likerUsername: username,
        freetId: likeCopy.freetId ? likeCopy.freetId._id.toString() : undefined,
        replyId: likeCopy.replyId ? likeCopy.replyId._id.toString() : undefined
      };
}

export {
    constructLikeResponse
}