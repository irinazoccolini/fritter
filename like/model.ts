import { Freet } from '../freet/model';
import {Schema, model} from 'mongoose';
import { Types } from "mongoose"
import { Reply } from '../reply/model';
import { User } from '../user/model';

export type Like = {
    _id: Types.ObjectId;
    likerId: Types.ObjectId;
    freetId: Types.ObjectId;
    replyId: Types.ObjectId;
}

export type PopulatedLike = {
    _id: Types.ObjectId,
    likerId: User,
    freetId: Freet,
    replyId: Reply
}

const LikeSchema = new Schema<Like>({
    // the id of the user who liked the item
    likerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    // the id of the freet that was liked
    freetId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Freet"
    },
    // the id of the reply that was liked
    replyId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Reply"
    }
})

const LikeModel = model<Like>("Like", LikeSchema);
export default LikeModel;