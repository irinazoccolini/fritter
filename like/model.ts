import {Schema, model} from 'mongoose';
import { Types } from "mongoose"

export type Like = {
    _id: Types.ObjectId;
    likerId: Types.ObjectId;
    freetId: Types.ObjectId;
    replyId: Types.ObjectId;
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