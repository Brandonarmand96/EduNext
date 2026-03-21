import type { Request, Response } from "express";
import User from "../models/userModel";

//@desc Register a new user
//@route POST /api/users/register
//@access Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role, studentClass, teacherSubject } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            res.status(400).json({ message: "Please provide all required fields" });
            return;
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }

        // Prevent privilege escalation
        const allowedRole = role && ["teacher", "student", "parent"].includes(role)
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
        // dont send error to frontend 
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};