import { Document, Types } from "mongoose"
import { Request } from "express"

export interface UserInterface extends Document {
    _id: Types.ObjectId
    fullname: string
    email: string
    password: string
    otp?: string
    otpExpireTime?: Date
    verify: boolean
    accessToken?: string
    refreshToken?: string
    refreshTokenExpiry?: Date
    role: "ADMIN" | "USER"
    status: "ACTIVE" | "BLOCK"
}

export interface SessionPayload {
  id: string;
  email: string;
  fullname: string;
  role: "USER" | "ADMIN";
}


export interface SessionInterface extends Request{
  session? : SessionPayload  
}