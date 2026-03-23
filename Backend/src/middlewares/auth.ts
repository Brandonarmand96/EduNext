import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { IUser, UserRoles } from "../models/userModel";
import User from "../models/userModel";

export interface AuthRequest extends Request {
    user?: IUser;
}

interface JwtPayload {
    userId: string;
}

// Protect middleware
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Account is deactivated" });
        }

        req.user = user as IUser;

        next();

    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

// Role-based authorization
/**
 * Accepts a list of allowed roles(e.g 'admin, 'teacher')
 * usage: router.post('/', protect , authorize('admin'), post)
 */
export const authorize = (roles: UserRoles[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }

        next();
    };
};







// import type { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken"
// import type { IUser, UserRoles } from "../models/userModel";
// import User from "../models/userModel";

// export interface AuthRequest extends Request {
//     user?: IUser
// }

// // protect routes middleware
// export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    
//     let token 

//     // check for token in cookies
//     if (req.cookies && req.cookies.jwt){
//         token = req.cookies.jwt
//     }

//     if (token) {
//         try {
//             const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string)

//             req.user = (await User.findById(decoded.userId).select("-password")) as IUser

//             next()

//         } catch (error) {
//             res.status(401).json({
//                 message: "Not authorized, token failed"
//             })
//         }
//     } else {
//         res.status(401).json({
//             message: "Not authorized, no token"
//         })
//     }
// }


// /**
//  * Accepts a list of allowed roles(e.g 'admin, 'teacher')
//  * usage: router.post('/', protect , authorize('admin'), post)
//  */

// export const authorize = (roles: UserRoles[]) => {
//     return (req: AuthRequest, res: Response, next: NextFunction) => {

//         if (!req.user) {
//             return res.status(401).json({
//                 message: "Not authorized, user not found"
//             })
//         }

//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({
//                 message: `User role ${req.user.role} is not authorized to access this route`,
//             })
//         }

//         // user has permission to proceed

//         next()
//     }
// }



