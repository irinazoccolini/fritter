import { Freet } from 'freet/model';
import {Schema, model} from 'mongoose';
import { Types } from "mongoose"
import { Reply } from 'reply/model';
import { User } from 'user/model';

export type Report = {
    _id: Types.ObjectId;
    reporterId: Types.ObjectId;
    freetId: Types.ObjectId;
    replyId: Types.ObjectId;
}

export type PopulatedReport = {
    _id: Types.ObjectId;
    reporterId: User;
    freetId: Freet;
    replyId: Reply;
}

const ReportSchema = new Schema<Report>({
    // the id of the user who reported the item
    reporterId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    // the id of the freet that was reported
    freetId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Freet"
    },
    // the id of the reply that was reported
    replyId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Reply"
    }
})

const ReportModel = model<Report>("Report", ReportSchema);
export default ReportModel;