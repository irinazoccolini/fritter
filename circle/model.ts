import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Circle = {
    _id: Types.ObjectId;
    creatorId: Types.ObjectId;
    name: string;
    members: Types.ObjectId[];
    deletable: boolean;
}

export type PopulatedCircle = {
    _id: Types.ObjectId;
    creatorId: User;
    name: string;
    members: User[],
    deletable: boolean;
}

const CircleSchema = new Schema<Circle>({
    creatorId: {
        type: Schema.Types.ObjectId,
        required: true, 
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User"
    }],
    deletable: {
        type: Boolean,
        required: true
    }
})

const CircleModel = model<Circle>('Circle', CircleSchema);
export default CircleModel;
