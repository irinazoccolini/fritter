import type {HydratedDocument} from 'mongoose';
import type {Follow, PopulatedFollow} from '../follow/model';

type FollowResponse = {
    _id: string,
    follower: string,
    followee: string
}

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A follow
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
 const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
    const followCopy: PopulatedFollow = {
      ...follow.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    const followerUsername = followCopy.follower.username;
    delete followCopy.follower;
    const followeeUsername = followCopy.followee.username;
    delete followCopy.followee;
    return {
      ...followCopy,
      _id: followCopy._id.toString(),
      follower: followerUsername,
      followee: followeeUsername
    };
  };
  
  export {
    constructFollowResponse
  };
  