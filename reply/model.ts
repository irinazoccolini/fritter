import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import { Circle } from '../circle/model';

export type Reply = {
    _id: Types.ObjectId;
    authorId: Types.ObjectId;
    parentFreet: Types.ObjectId;
    parentReply: Types.ObjectId;
    content: string;
    dateCreated: Date;
    dateModified: Date;
    anonymous: Boolean;
    circle: Types.ObjectId;
    private: Boolean;
};

export type PopulatedReply = {
    _id: Types.ObjectId;
    authorId: User;
    parentFreet: Freet;
    parentReply: Reply;
    content: string;
    dateCreated: Date;
    dateModified: Date;
    anonymous: Boolean;
    circle: Circle;
    private: Boolean;
};

const ReplySchema = new Schema<Reply>({
    authorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    parentFreet: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Freet"
    },
    parentReply: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Reply"
    },
    content: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    dateModified: {
        type: Date,
        required: true
    },
    anonymous: {
        type: Boolean,
        required: true
    },
    circle: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Circle"
    },
    private: {
        type: Boolean,
        required: true
    }
});

const ReplyModel = model<Reply>("Reply", ReplySchema);
export default ReplyModel;