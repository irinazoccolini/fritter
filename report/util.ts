import type {Report, PopulatedReport} from './model';
import {HydratedDocument} from 'mongoose';

type ReportResponse = {
    _id: string,
    freetId: string,
    replyId: string,
    reporterUsername: string
}

/**
 * Transform a raw report object to a formatted object with all the information needed on the frontend
 * 
 * @param {HydratedDocument<Report>} report - the report object
 * @return {ReportResponse} - the formatted response
 */
const constructReportResponse = (report: HydratedDocument<Report>): ReportResponse => {
    const reportCopy: PopulatedReport = {
        ...report.toObject({
          versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    const {username} = reportCopy.reporterId;
    delete reportCopy.reporterId;
    return {
        ...reportCopy,
        _id: reportCopy._id.toString(),
        reporterUsername: username,
        freetId: reportCopy.freetId ? reportCopy.freetId._id.toString() : undefined,
        replyId: reportCopy.replyId ? reportCopy.replyId._id.toString() : undefined
      };
}

export {
    constructReportResponse
}