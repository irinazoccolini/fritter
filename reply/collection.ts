import type {HydratedDocument, Types} from 'mongoose';
import ReplyModel from './model';
import type { Reply } from './model';

class ReplyCollection {
    /**
     * Add a reply to a freet to the collection.
     * 
     * @param {string} authorId - the author of the reply
     * @param {string} freetId - the id of the freet that is being replied to
     * @param {boolean} anonymous - whether the reply is posted anonymously
     * @param {string} content - the content of the reply
     * @return {Promise<HydratedDocument<Reply>>} - The newly created reply
     */
    static async addReplyToFreet(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string, 
                        anonymous: boolean, content: string): Promise<HydratedDocument<Reply>>{
        const date = new Date()
        const reply = new ReplyModel({
            authorId: authorId,
            parentFreet: freetId,
            content: content,
            dateCreated: date,
            dateModified: date,
            anonymous: anonymous,
            deleted: false
        });
        await reply.save(); // Saves reply to MongoDB
        return reply.populate(['authorId', 'parentFreet']);
    }

    /**
     * Add a reply to a reply to the collection.
     * 
     * @param {string} authorId - the author of the reply
     * @param {string} replyId - the id of the reply that is being replied to
     * @param {boolean} anonymous - whether the reply is posted anonymously
     * @param {string} content - the content of the reply
     * @return {Promise<HydratedDocument<Reply>>} - The newly created reply
     */
    static async addReplyToReply(authorId: Types.ObjectId | string, replyId: Types.ObjectId | string, 
        anonymous: boolean, content: string): Promise<HydratedDocument<Reply>>{
        const date = new Date()
        const reply = new ReplyModel({
        authorId: authorId,
        parentReply: replyId,
        content: content,
        dateCreated: date,
        dateModified: date,
        anonymous: anonymous,
        deleted: false
        });
        await reply.save(); // Saves reply to MongoDB
        return reply.populate(['authorId', 'parentReply']);
    }

    /**
     * Delete a reply from the collection.
     * 
     * @param {string} replyId - the id of the reply to delete
     */
    static async deleteOne(replyId: Types.ObjectId | string): Promise<void>{
        const reply = await ReplyModel.findOne({_id: replyId});
        reply.deleted = true;
        reply.dateModified = new Date();
        await reply.save();
        return reply.populate(["authorId", "parentFreet", "parentReply"]);
    }

    /**
     * Get all replies to a freet.
     * 
     * @param {string} freetId - the id of the parent freet 
     * @return {Promise<HydratedDocument<Reply>[]>} - An array of all of the replies
     */
    static async findAllByParentFreet(freetId: Types.ObjectId | string): Promise<HydratedDocument<Reply>[]>{
        return ReplyModel.find({parentFreet: freetId}).populate(["authorId", "parentFreet"]);
    }

    /**
     * Get all replies to a reply.
     * 
     * @param {string} replyId - the id of the parent reply 
     * @return {Promise<HydratedDocument<Reply>[]>} - An array of all of the replies
     */
    static async findAllByParentReply(replyId: Types.ObjectId | string): Promise<HydratedDocument<Reply>[]>{
        return ReplyModel.find({parentReply: replyId}).populate(["authorId", "parentReply"]);
    }
    
    /**
     * Find a reply by replyId
     * 
     * @param {string} replyId - the id of the reply
     * @return {Promise<HydratedDocument<Reply>> | Promise<null> } - The reply with the given replyId, if any
     */
    static async findOneById(replyId: Types.ObjectId | string): Promise<HydratedDocument<Reply>>{
        return ReplyModel.findOne({_id: replyId}).populate(["authorId", "parentFreet", "parentReply"]);
    }

    /**
     * Get all replies by a specific author.
     * 
     * @param {string} authorId - the id of the author
     * @return {Promise<HydratedDocument<Reply>[]>} - An array of all of the replies
     */
    static async findAllByAuthor(authorId: Types.ObjectId | string): Promise<HydratedDocument<Reply>[]>{
        return ReplyModel.find({authorId: authorId}).populate(["authorId", "parentFreet", "parentReply"]);
    }

    /**
     * Delete all replies by a specific author.
     * 
     * @param {string} authorId - the id of the author
     */
    static async deleteManyByAuthor(authorId: Types.ObjectId | string): Promise<void>{
        await ReplyModel.updateMany({authorId: authorId}, {deleted: true, dateModified: new Date()});
    }

    /**
     * Update a reply with the new content
     *
     * @param {string} replyId - The id of the reply to be updated
     * @param {string} content - The new content of the reply
     * @return {Promise<HydratedDocument<Reply>>} - The newly updated reply
     */
    static async updateOne(replyId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Reply>> {
        const reply = await ReplyModel.findOne({_id: replyId});
        reply.content = content;
        reply.dateModified = new Date();
        await reply.save();
        return reply.populate(["authorId", "parentFreet", "parentReply"]);
    }
}

export default ReplyCollection;