import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../model/User';
import dotenv from 'dotenv';

// const JWT_SECRET = process.env.JWT_SECRET;
dotenv.config();


// signup controller
export async function signup(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in .env file");
    }

    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be atleat 8 characters "
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const userExisted = await userModel.findOne({ email });
        if (userExisted) {
            return res.status(400).json({
                message: "Email already existed, Please use a different email."
            });
        }

        const newUser = await userModel.create({
            firstName,
            lastName,
            email,
            password
        });

        if (newUser) {
            return res.status(200).json({
                success: true,
                message: "User registered"
            });
        }

        res.status(201).json({
            success: true,
            user: newUser
        })
    } catch (error) {
        console.log("Error in signUp controller: ", error);
        res.json({
            message: "Internal server error in signup"
        })
    }
}

// login controller
export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

        const userExisted = await userModel.findOne({ email });
        if (!userExisted) {
            return res.status(401).json({
                message: "Invalid email or password!"
            });
        }

        const isPassValid = await bcrypt.compare(password, userExisted.password);
        if (!isPassValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        console.log("userExisted", userExisted);
        console.log("JWT: ", process.env.JWT_SECRET);

        //payload
        const payload = { userId: userExisted._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string);

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.json({
            token: token,
            success: true
        })

    } catch (error) {
        console.log("Error in login controller: ", error);
        res.json({
            message: "Internal server error in login"
        })
    }
}

// logout controller
export async function logout(req: Request, res: Response) {
    try {
        res.clearCookie("jwt");
        res.json({
            success: true,
            message: "Logout succeed!"
        })
    } catch (error) {
        console.log("Error while logout: ", error);
        res.status(401).json({
            success: false,
            message: "Internal server error in logout"
        })
    }
}