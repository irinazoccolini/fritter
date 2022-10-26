import type {HydratedDocument, Types} from 'mongoose';
import { isValidCircleViewer } from './middleware';
import type {Circle} from './model';
import CircleModel from './model';

class CircleCollection {

    /**
     * Add the mutuals circle to the collection.
     * 
     * @param {string} creatorId - the creator of the circle
     * @return {Promise<HydratedDocument<Circle>>} - The newly created circle
     */
    static async addMutuals(creatorId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
        const circle = new CircleModel({
            creatorId: creatorId,
            name: "Mutuals",
            members: [],
            deletable: false
        });
        await circle.save();
        return circle.populate(["creatorId", "members"]);
    }

    /**
     * Add a circle to the collection.
     * 
     * @param {string} creatorId - the creator of the circle
     * @param {string} name - the name of the circle
     * @param {Types.ObjectId[]} members - the members of the circle
     * @return {Promise<HydratedDocument<Circle>>} - The newly created circle
     */
    static async addOne(creatorId: Types.ObjectId | string, name: string, members: Types.ObjectId[]): Promise<HydratedDocument<Circle>>{
        
        const circle = new CircleModel({
            creatorId: creatorId,
            name: name,
            members: members,
            deletable: true
        });
        await circle.save();
        return circle.populate(["creatorId", "members"]);
    };

    /**
     * Delete a circle from the collection.
     * 
     * @param {string} circleId - the id of the circle to be deleted
     */
    static async deleteOne(circleId: Types.ObjectId | string): Promise<void> {
        const circle = await CircleModel.deleteOne({_id: circleId});
    }

    /**
     * Edit a circle's name.
     * 
     * @param {string} name - the new circle name
     * @param {string} circleId - the circle to edit
     * @returns {Promise<HydratedDocument<Circle>>} - the updated circle
     */
    static async updateName(circleId: string | Types.ObjectId, name: string): Promise<HydratedDocument<Circle>>{
        const circle = await CircleModel.findOne({_id: circleId});
        circle.name = name;
        await circle.save();
        return circle.populate(['creatorId', 'members']);
    }

    /**
     * Edit a circle's members.
     * @param {Types.ObjectId[]} members - the new circle members
     * @param {string} circleId - the circle to edit
     * @returns {Promise<HydratedDocument<Circle>>} - the updated circle
     */
    static async updateMembers(circleId: string | Types.ObjectId, members: Types.ObjectId[]): Promise<HydratedDocument<Circle>>{
        const circle = await CircleModel.findOne({_id: circleId});
        circle.members = members;
        await circle.save();
        return circle.populate(['creatorId', 'members']);
    }

    /**
     * Get a circle by id.
     * 
     * @param {string} circleId - the id of the circle
     * @returns {Promise<HydratedDocument<Circle>>} - The circle corresponding to the id, if any
     */
    static async findOneById(circleId: Types.ObjectId | string): Promise<HydratedDocument<Circle>>{
        return CircleModel.findOne({_id: circleId}).populate(['creatorId', 'members']);
    }

    /**
     * Get a user's circle by name.
     * 
     * @param {string} name - the name of the circle
     * @param {string} creatorId - the id of the circle creator
     * @return {Promise<HydratedDocument<Circle>>} - The circle with the given name, if it exists
     */
    static async findOneByNameAndUser(name: string, creatorId: string | Types.ObjectId): Promise<HydratedDocument<Circle>> {
        return CircleModel.findOne({name: name, creatorId: creatorId}).populate(["creatorId", "members"]);
    }
    
    /**
     * Get circles by a users id
     * 
     * @param {string} creatorId - the user id that we want to find circles for 
     * @return {Promise<HydratedDocument<Circle>[]>} - An array of the circles that the user has created
     */
    static async findManyByCreatorId(creatorId: string | Types.ObjectId): Promise<Array<HydratedDocument<Circle>>> {
        return CircleModel.find({creatorId: creatorId}).populate(["creatorId", "members"]);
    }

    /**
     * Delete circles by a user's id
     * 
     * @param {string} creatorId - the user id that we want to delete circles for
     */
     static async deleteManyByUser(creatorId: Types.ObjectId | string): Promise<void> {
        await CircleModel.deleteMany({creatorId: creatorId});
    }

    /**
     * Find all circles that a user is a member of
     * 
     * @param memberId 
     * @returns 
     */
    static async findManyByMember(memberId: Types.ObjectId | string): Promise<Array<HydratedDocument<Circle>>>{
        return CircleModel.find({members: memberId}).populate(["creatorId", "members"]);
    }

    /**
     * Add a member to a user's mutuals circle
     * 
     * @param memberId
     * @param creatorId
     */
    static async addMemberToMutuals(memberId: Types.ObjectId, creatorId: Types.ObjectId | string): Promise<void> {
        const circle = await CircleCollection.findOneByNameAndUser("Mutuals", creatorId);
        circle.members = circle.members.concat([memberId]);
        circle.save();
        circle.populate(["creatorId", "members"]);
    }

}

export default CircleCollection;