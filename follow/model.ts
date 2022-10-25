import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Follow = {
    _id: Types.ObjectId,
    follower: Types.ObjectId,
    followee: Types.ObjectId
}

const FollowSchema = new Schema<Follow>({
    follower: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    followee: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;