import { Schema, model, models } from "mongoose"
import { UserInterface } from "./user.interface"

const userSchema = new Schema<UserInterface>(
  {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    otp: {
      type: String
    },

    otpExpireTime: {
      type: Date
    },

    verify: {
      type: Boolean,
      default: false
    },
    refreshToken: {
      type: String
    },
    refreshTokenExpiry: {
      type: Date
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER"
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCK"],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
)


const UserModel =models.User ||  model<UserInterface>("User", userSchema)

export default UserModel