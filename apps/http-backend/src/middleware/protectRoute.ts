import express, { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../model/User";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

// Extend Express's Request type to include "user"
interface AuthReq extends Request {
    user?: any;
}

export async function protectRoute(req: AuthReq, res: Response, next: NextFunction) {
    const token = req.cookies.jwt;

    if (!token) {
        return res.json({
            message: "Unauthorized - No token provided"
        })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;


    if (typeof decoded === "string" || !decoded.userId) {
        return res.status(401).json({
            message: "Invalid or token expired!"
        })
    }

    const userPresent = await userModel.findById(decoded.userId).select("-password");
    if (!userPresent) {
        return res.status(401).json({
            message: "Unauthorized - User not found!"
        })
    }

    //make the interface that extends the "REquet"
    req.user = userPresent;
    next();
}


export default protectRoute;