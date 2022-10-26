import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';

class LikeCollection {

  /**
   * Add a like to a freet to the collection.
   *
   * @param {string} likerId - The id of the user who liked the freet
   * @param {string} freetId - The id of the freet that was liked
   * @return {Promise<HydratedDocument<Like>>} - The newly created like
  */
  static async addFreetLike(likerId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      likerId: likerId,
      freetId: freetId
    });
    await like.save(); // Saves like to MongoDB
    return like.populate(['freetId', 'likerId']);
  }

   /**
   * Get the like for a given freet by a given user
   *
   * @param {string} likerId - The id of the user who liked the freet
   * @param {string} freetId - The id of the freet 
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
  static async findOneByFreetAndLiker(likerId: string, freetId: string): Promise<Array<HydratedDocument<Like>>> {
    const like = LikeModel.findOne({freetId: freetId, likerId: likerId})
    return like.populate(['freetId', 'likerId']);
  }

  /**
   * Get all the likes for a given freet
   *
   * @param {string} freetId - The id of the freet 
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
  static async findAllByFreet(freetId: string): Promise<Array<HydratedDocument<Like>>> {
    const like = LikeModel.find({freetId: freetId})
    return like.populate(['freetId', 'likerId']);
  }

  /**
   * Get all the likes for a given reply
   *
   * @param {string} replyId - The id of the reply 
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
  static async findAllByReply(replyId: string): Promise<Array<HydratedDocument<Like>>> {
    const like = LikeModel.find({replyId: replyId})
    return like.populate(['replyId', 'likerId']);
  }

  /**
   * Get the like for a given reply by a given user
   *
   * @param {string} likerId - The id of the user who liked the reply
   * @param {string} replyId - The id of the reply 
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
  static async findOneByReplyAndLiker(likerId: string, replyId: string): Promise<Array<HydratedDocument<Like>>> {
    const like = LikeModel.findOne({replyId: replyId, likerId: likerId})
    return like.populate(['replyId', 'likerId']);
  }

  /**
   * Add a like to a reply to the collection.
   *
   * @param {string} likerId - The id of the user who liked the reply
   * @param {string} replyId - The id of the reply that was liked
   * @return {Promise<HydratedDocument<Like>>} - The newly created like
  */
  static async addReplyLike(likerId: Types.ObjectId | string, replyId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      likerId: likerId,
      replyId: replyId
    });
    await like.save(); // Saves like to MongoDB
    return like.populate(['replyId', 'likerId']);
  }

  /**
   * Unlike a freet
   *
   * @param {string} likerId - The username of the user who liked the tweet
   * @param {string} freetId - The id of the freet 
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteFreetLike(likerId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await LikeModel.deleteOne({freetId: freetId, likerId: likerId});
    return freet !== null;
  }

  /**
   * Unlike a reply.
   *
   * @param {string} likerId - The username of the user who liked the reply
   * @param {string} replyId - The id of the reply 
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteReplyLike(likerId: Types.ObjectId | string, replyId: Types.ObjectId | string): Promise<boolean> {
    const freet = await LikeModel.deleteOne({replyId: replyId, likerId: likerId});
    return freet !== null;
  }
  
  /**
   * Delete all the likes of a freet
   */
  static async deleteManyByFreet(freetId: Types.ObjectId | string): Promise<void>{
    await LikeModel.deleteMany({freetId: freetId});
  }

  /**
   * Delete all the likes of a reply
   */
   static async deleteManyByReply(replyId: Types.ObjectId | string): Promise<void>{
    await LikeModel.deleteMany({replyId: replyId});
  }
}

export default LikeCollection;