import jwt from "jsonwebtoken";
import type {Response} from "express"

export const generateToken = (userId: string, res: Response) => {

    if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({userId}, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
        algorithm: "HS512"
    })

    //attach token to http-only cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
        path: "/"
    })
}