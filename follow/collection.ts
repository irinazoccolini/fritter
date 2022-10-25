import type {HydratedDocument, Types} from 'mongoose';
import FollowModel, { Follow } from './model';

class FollowCollection {

    /**
     * Add a follow 
     * 
     * @param {string} followerId - the id of the user doing the following
     * @param {string} followeeId - the id of the user being followed
     * @returns {Promise<HydratedDocument<Follow>>} - the newly created follow
     */
    static async addFollow(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        const follow = new FollowModel({
            followee: followeeId,
            follower: followerId
        });
        await follow.save()
        return follow.populate(["follower", "followee"]);
    }

    /**
     * Delete a follow
     * 
     * @param {string} followerId - the id of the user doing the following
     * @param {string} followeeId - the id of the user being followed
     */
    static async deleteFollow(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<void>{
        await FollowModel.deleteOne({followee: followeeId, follower: followerId});
    }

    /**
     * Get all the followers of a user
     * 
     * @param {string} followeeId - the id of the user being followed
     * @returns {Promise<Array<HydratedDocument<Follow>>>} - an array of the user's followers
     */
    static async findByFollowee(followeeId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>>{
        return FollowModel.find({followee: followeeId}).populate(["follower", "followee"]);
    }


    /**
     * Get all the users a user is following
     * @param {string} followerId - the id of the user doing the following
     * @returns {Promise<Array<HydratedDocument<Follow>>>} - an array of the user's followers
     */
     static async findByFollower(followerId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>>{
        return FollowModel.find({follower: followerId}).populate(["follower", "followee"]);
    }


    /**
     * Delete all the followers of a user
     * 
     * @param {string} followeeId - the id of the user being followed
     */
     static async deleteByFollowee(followeeId: Types.ObjectId | string): Promise<void>{
        await FollowModel.deleteMany({followee: followeeId})
    }


    /**
     * Delete all followings of a user
     * 
     * @param {string} followerId - the id of the user doing the following
     */
     static async deleteByFollower(followerId: Types.ObjectId | string): Promise<void>{
        await FollowModel.deleteMany({follower: followerId})
    }

    /** 
     * Get a follow by follower and followee ids.
     *  
     * @param {string} followerId - the id of the user doing the following
     * @param {string} followeeId - the id of the user being followed
     * @returns {Promise<HydratedDocument<Follow>>} - the follow, if it exists
     */
    static async findOneByFollowerAndFollowee(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>>{
        const follow = FollowModel.findOne({follower: followerId, followee: followeeId})
        return follow.populate(['follower', 'followee']);
    }
}

export default FollowCollection;