import type mongoose from "mongoose";
import {  ActivityLog } from "../models/activitieslogModel";



// export const logActivity = async(
//     userId: string,
//     action: string,
//     details?: string
// ) => {
//     try {
//         await ActivitiesLog.create({
//             user: userId,
//             action,
//             details,
//         })
//     } catch (error) {
//         console.error("failed to log activity:", error)

//         // res.status(500).json({
//         //     message: "internal server error"
//         // })
//     }
// }

export const logActivity = (
    userId: mongoose.Types.ObjectId,
    action: string,
    details?: any
) => {
    ActivityLog.create({
        user: userId,
        action,
        details,
    }).catch((error) => {
        console.error("Failed to log activity:", error);
    });
};