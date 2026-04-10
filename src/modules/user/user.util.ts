import bcrypt from 'bcrypt'
import crypto from "crypto";
import jwt, { SignOptions } from 'jsonwebtoken'

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}

export const generateToken = (length = 64) => {
  return crypto.randomBytes(length).toString("hex");
};

export const getAccessToken = async (auth:any ) => {

    const payload = {
      id: auth._id,
      email: auth.email,
      fullname: auth.fullname,
      role: auth.role
    }

    const secret = process.env.AUTH_SECRET
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY

    if (!secret) {
        throw new Error("Auth secret is missing.")
    }

    if (!expiresIn) {
        throw new Error("Access token expiry is missing.")
    }

    const options: SignOptions = {
        expiresIn: expiresIn as SignOptions["expiresIn"]
    }

    const token = jwt.sign(payload, secret, options)

    return token
}

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
