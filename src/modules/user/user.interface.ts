import { Document, Types } from "mongoose"

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