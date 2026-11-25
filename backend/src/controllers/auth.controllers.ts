import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel, { type IUser } from "../models/user.model.js";
import { config } from "../config/config.js";

function sendTokenResponse(
  user: IUser,
  res: Response,
  statusCode: number,
  message: string,
) {
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(statusCode).json({
    message,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const register = async (req: Request, res: Response) => {
  const { email, contact, password, fullname } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or contact already exists",
      });
    }

    // Password is hashed by the model's pre-save hook.
    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
    });

    return sendTokenResponse(user, res, 201, "User registered successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
