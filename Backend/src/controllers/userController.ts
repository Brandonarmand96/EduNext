import type { Request, Response } from "express";
import User from "../models/userModel"
import { generateToken } from "../utils/generateToken";


//@desc Register a new user
//@route POST /api/users/register
//@access Private (Admin & Teacher only)
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name, email, password, role, studentClass, teacherSubject,} = req.body; 
        
        // check if user already exists
        const existingUser = await User.findOne({email})

        if (existingUser) {
            res.status(409).json({
                message: "User already exists"
            })
            return
        }

        //create user
        const newUser = await User.create({
            name, email, password, role, studentClass, teacherSubject,
        })

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                isActive: newUser.isActive,
                studentClass: newUser.studentClass,
                teacherSubject: newUser.teacherSubject,
                message: "User Registered successfully"
            })
        } else {
            res.status(400).json({
                message: "invalid user data"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error
        })
    }
}



// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.body.email?.toLowerCase().trim();
        const { password } = req.body;

        // Validate input
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Check if account is active
        if (!user.isActive) {
            res.status(403).json({ message: "Account is deactivated" });
            return;
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Generate token
        generateToken(user._id.toString(), res);

        // Send safe user data
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};