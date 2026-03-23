import type { Request, Response } from "express";
import User from "../models/userModel";
import { logActivity } from "../utils/activitiesLog";

//@desc Register a new user
//@route POST /api/users/register
//@access Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, password, role, studentClass, teacherSubject } = req.body;
        const email = req.body.email?.toLowerCase().trim();

        // Validate input
        if (!name || !email || !password) {
            res.status(400).json({ message: "All required fields must be provided" });
            return;
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }

        // Prevent role abuse
        const allowedRole = ["teacher", "student", "parent"].includes(role)
            ? role
            : "student";

        // Create user
        const newUser = await User.create({
            name,
            email,
            password,
            role: allowedRole,
            studentClass,
            teacherSubject,
        });

        // Log activity (non-blocking)
        logActivity(
            newUser._id.toString(),
            "REGISTER",
            `Registered user with email: ${newUser.email}`
        );

        // Send response
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            isActive: newUser.isActive,
            studentClass: newUser.studentClass,
            teacherSubject: newUser.teacherSubject,
            message: "User registered successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};