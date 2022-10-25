import { HydratedDocument } from "mongoose"
import type {Circle, PopulatedCircle} from '../circle/model';

type CircleResponse = {
    _id: string,
    creator: string,
    name: string,
    members: string[],
    deletable: boolean
}

/**
 * Transform a raw circle object to a formatted response for the frontend.
 * 
 * @param {HydratedDocument<Circle>} - the circle
 * @return {CircleResponse} - the formatted response
 */
const constructCircleResponse = (circle: HydratedDocument<Circle>): CircleResponse => {
    const circleCopy: PopulatedCircle = {
        ...circle.toObject({
          versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    const memberUsernames = circleCopy.members.map(member => member.username);
    delete circleCopy.members;
    const {username} = circleCopy.creatorId;
    delete circleCopy.creatorId;
    return {
        ...circleCopy,
        _id: circleCopy._id.toString(),
        creator: username,
        members: memberUsernames
      };
}

export {
    constructCircleResponse
}