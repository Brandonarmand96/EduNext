import mongoose, {Schema, Document} from "mongoose";

export interface IActivitylog extends Document {
    user: string; // Who did it
    action: string; // What did the person do
    details?: string; // optional extra details 
    createdAt: Date;
}

const activitieslogSchema: Schema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true},
    action: {type: String, required: true},
    details: {type: String},
}, {
    timestamps: true
}) 

export const ActivitiesLog = mongoose.model<IActivitylog>('ActivitiesLog', activitieslogSchema)


// import mongoose, { Schema, Document } from "mongoose";

// export interface IActivityLog extends Document {
//     user: mongoose.Types.ObjectId;
//     action: string;
//     details?: any;
//     createdAt: Date;
//     updatedAt?: Date;
// }

// const activityLogSchema: Schema = new Schema({
//     user: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     action: {
//         type: String,
//         required: true
//     },
//     details: {
//         type: Schema.Types.Mixed
//     }
// }, {
//     timestamps: true
// });

// export const ActivityLog = mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);