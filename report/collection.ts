import type {HydratedDocument, Types} from 'mongoose';
import type {Report} from './model';
import ReportModel from './model';

class ReportCollection {
  /**
   * Add a freet report to the collection
   *
   * @param {string} reporterId - The id of the user who reported the freet
   * @param {string} freetId - The id of the freet that was reported
   * @return {Promise<HydratedDocument<Report>>} - The newly created report
   */
  static async addFreetReport(reporterId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Report>> {
    const report = new ReportModel({
      reporterId: reporterId,
      freetId: freetId
    });
    await report.save(); // Saves report to MongoDB
    return report.populate(['freetId', 'reporterId']);
  }

  /**
   * Add a reply report to the collection
   *
   * @param {string} reporterId - The id of the user who reported the reply
   * @param {string} replyId - The id of the reply that was reported
   * @return {Promise<HydratedDocument<Report>>} - The newly created report
   */
   static async addReplyReport(reporterId: Types.ObjectId | string, replyId: Types.ObjectId | string): Promise<HydratedDocument<Report>> {
    const report = new ReportModel({
      reporterId: reporterId,
      replyId: replyId
    });
    await report.save(); // Saves report to MongoDB
    return report.populate(['replyId', 'reporterId']);
  }

  /**
   * Get all the reports for a given freet
   *
   * @param {string} freetId - The id of the freet 
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the reports
   */
  static async findAllByFreet(freetId: string): Promise<Array<HydratedDocument<Report>>> {
    const report = ReportModel.find({freetId: freetId});
    return report.populate(['freetId', 'reporterId']);
  }

  /**
   * Get all the reports for a given reply
   *
   * @param {string} replyId - The id of the reply 
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the reports
   */
   static async findAllByReply(replyId: string): Promise<Array<HydratedDocument<Report>>> {
    const report = ReportModel.find({replyId: replyId});
    return report.populate(['replyId', 'reporterId']);
  }

  /**
   * Get the report for a given freet by a given user
   *
   * @param {string} reporterId - The id of the user who reported the freet
   * @param {string} freetId - The id of the freet 
   * @return {Promise<HydratedDocument<Report>[]>} - An array of all of the reports
   */
  static async findOneByFreetAndReporter(reporterId: string, freetId: string): Promise<Array<HydratedDocument<Report>>> {
    const report = ReportModel.findOne({freetId: freetId, reporterId: reporterId});
    return report.populate(['freetId', 'reporterId']);
  }

  /**
   * Get the report for a given reply by a given user
   *
   * @param {string} reporterId - The id of the user who reported the reply
   * @param {string} replyId - The id of the reply 
   * @return {Promise<HydratedDocument<Report>[]>} - An array of all of the reports
   */
   static async findOneByReplyAndReporter(reporterId: string, replyId: string): Promise<Array<HydratedDocument<Report>>> {
    const report = ReportModel.findOne({replyId: replyId, reporterId: reporterId})
    return report.populate(['replyId', 'reporterId']);
  }

    /**
   * Delete all the reports of a freet
   */
     static async deleteManyByFreet(freetId: Types.ObjectId | string): Promise<void>{
      await ReportModel.deleteMany({freetId: freetId});
    }
  
    /**
     * Delete all the reports of a reply
     */
     static async deleteManyByReply(replyId: Types.ObjectId | string): Promise<void>{
      await ReportModel.deleteMany({replyId: replyId});
    }

}

export default ReportCollection;