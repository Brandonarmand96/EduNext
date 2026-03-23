import type { Request, Response } from "express";
import { ActivityLog } from "../models/activitieslogModel";

// @desc Get System Activity Logs
// @route GET /api/activity
// @access Private/Admin
export const getAllActivities = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Number(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        // Filtering
        const query: any = {};

        if (req.query.user) query.user = req.query.user;
        if (req.query.action) query.action = req.query.action;

        const count = await ActivityLog.countDocuments(query);

        const logs = await ActivityLog.find(query)
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.status(200).json({
            logs,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};