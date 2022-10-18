import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';

class LikeCollection {
   /**
   * Add a like to the collection
   *
   * @param {string} likerId - The id of the user who liked the freet
   * @param {string} freetId - The id of the freet that was liked
   * @return {Promise<HydratedDocument<Like>>} - The newly created like
   */
  static async addOne(likerId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      likerId,
      freetId,
    });
    await like.save(); // Saves like to MongoDB
    like.populate('likerId');
    return like.populate('freetId');
  }

   /**
   * Get the like for a given post by a given user
   *
   * @param {string} likerId - The id of the user who liked the freet
   * @param {string} freetId - The id of the freet 
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
     static async findOneByFreetAndLiker(likerId: string, freetId: string): Promise<Array<HydratedDocument<Like>>> {
        const like = LikeModel.find({freetId: freetId, likerId: likerId})
        like.populate('likerId');
        return like.populate('freetId');
      }

   /**
   * Get all the likes for a given freet
   *
   * @param {string} freetId - The id of the freet 
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
     static async findAllByFreet(freetId: string): Promise<Array<HydratedDocument<Like>>> {
        const like = LikeModel.find({freetId: freetId})
        like.populate('likerId');
        return like.populate('freetId');
      }

   /**
   * Unlike a freet
   *
   * @param {string} likerId - The username of the user who liked the tweet
   * @param {string} freetId - The id of the freet 
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteOne(likerId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await LikeModel.deleteOne({freetId: freetId, likerId: likerId});
    return freet !== null;
  }
}

export default LikeCollection;