import { Request, Response } from "express"
import { catchError, tryError } from "../../utils/serverErrorhandler"
import UserModel from "./user.model"
import { comparePassword, generateOTP, generateToken, getAccessToken, hashPassword } from "./user.util"
import moment from 'moment'
import { otpTemplate } from "../../templates/otpTemplate"
import sendMail from "../../utils/sendEmail"
import jwt from 'jsonwebtoken'

export const signup = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const { fullname, email, password } = body

        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            throw tryError("Email already registered. Please login.", 401);
        }

        const hashedPassword = await hashPassword(password) 

        const otp = generateOTP()
        const otpExpireTime = moment().add(10, "minutes").toDate()

        const user = await UserModel.create({
            fullname,
            email,
            password: hashedPassword,
            otp,
            otpExpireTime,
            verify: false,
            role: "USER"
        })

        await sendMail(email, "Verify Your DevSync Account", otpTemplate(otp))


        return res.json({
            success: true,
            message: "User created successfully. Please verify your email.",
            data: {email: user?.email, verify: user?.verify}
        })
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const login = async(req: Request, res: Response)=>{
    try {
        const body = req.body
          const {email, password} = body;
          const existingUser = await UserModel.findOne({ email })

            if (!existingUser) {
                throw tryError("User not found, please registered first.", 404);
            }

            const isPasswordMatch = await comparePassword(password, existingUser.password)

            if(!isPasswordMatch) {
                throw tryError("Invalid credentials", 400);
            }

            const accessToken = await getAccessToken(existingUser)
            const refreshToken = generateToken()
            const refreshTokenExpiry = moment().add(30, "days").toDate()

            existingUser.refreshToken = refreshToken
            existingUser.refreshTokenExpiry = refreshTokenExpiry
            await existingUser.save()

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: Number(process.env.COOKIE_MAX_AGE),
                domain: process.env.CLIENT_DOMAIN,
                secure: process.env.NODE_ENV === "dev" ? false : true,
                sameSite: false
            })
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE) || 30 * 24 * 60 * 60 * 1000,
                domain: process.env.CLIENT_DOMAIN,
                secure: process.env.NODE_ENV === "dev" ? false : true,
                sameSite: false
            })

            return res.json({
                success: true,
                message: "you are logged in  successfully!",
                role: existingUser.role,
                accessToken,
                refreshToken
            })
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const logOut = async(req: Request, res: Response)=>{
    try {
        res.cookie("accessToken", "", {
            httpOnly: true,
            maxAge: 0,
            domain: process.env.CLIENT_DOMAIN,
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: false
        })
        res.cookie("refreshToken", "", {
            httpOnly: true,
            maxAge: 0,
            domain: process.env.CLIENT_DOMAIN,
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: false
        })

        res.json({message: "Logout Success."})
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const verifyOtp = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const {email, otp} = body;

        const existingUser = await UserModel.findOne({ email })

        if (!existingUser) {
            throw tryError("User not found, please registered first.", 404);
        }

        if (moment().isAfter(existingUser.otpExpireTime)) {
            throw tryError("OTP has expired. Please request a new OTP.", 400);
        }
        
        if(otp !== existingUser.otp) {
            throw tryError("Invalid OTP", 400);
        }

        existingUser.verify = true
        existingUser.otp = undefined
        existingUser.otpExpireTime = undefined

        await existingUser.save()

        return res.json({
            success: true,
            message: "Account verified successfully"
        })
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const resendOtp = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const {email} = body
        
        const existingUser = await UserModel.findOne({ email })
        if (!existingUser) {
            throw tryError("User not found, please registered first.", 404);
        }

        const otp = generateOTP()
        const otpExpireTime = moment().add(10, "minutes").toDate()

        existingUser.otp = otp
        existingUser.otpExpireTime = otpExpireTime

        await sendMail(email, "Verify Your DevSync Account", otpTemplate(otp))
        await existingUser.save()

        return res.json({
            success: true,
            message: "OTP resend successfully"
        })
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const forgotPassword = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const {email} = body

        const existingUser = await UserModel.findOne({ email })
            if (!existingUser) {
            throw tryError("User not found, please registered first.", 404);
        }

        const otp = generateOTP()
        const otpExpireTime = moment().add(10, "minutes").toDate()

        existingUser.otp = otp
        existingUser.otpExpireTime = otpExpireTime

        await sendMail(email, "Verify Your DevSync Account", otpTemplate(otp))
        await existingUser.save()

        return res.json({
            success: true,
            message: "OTP send successfully"
        })
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const changePassword = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const {email, newPassword, otp} = body

        const existingUser = await UserModel.findOne({ email })
        if (!existingUser) {
            throw tryError("User not found, please registered first.", 404);
        }

        if (moment().isAfter(existingUser.otpExpireTime)) {
            throw tryError("OTP has expired. Please request a new OTP.", 400);
        }
        
        if(otp !== existingUser.otp) {
            throw tryError("Invalid OTP", 400);
        }

        existingUser.password = await hashPassword(newPassword)
        existingUser.verify = true
        existingUser.otp = undefined
        existingUser.otpExpireTime = undefined
        await existingUser.save()

        return res.json({
            success: true,
            message: "Password chnaged successfully please login to continue services."
        }) 
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const refreshToken = async(req: Request, res: Response)=>{
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            throw tryError("Please provide refresh token.", 400)
        }

        const user = await UserModel.findOne({ refreshToken })

        if (!user) {
            throw tryError("User not found.", 404)
        }

        if (moment().isAfter(user.refreshTokenExpiry)) {
            throw tryError("Refresh token expired, Please login.", 401)
        }

        const accessToken = await getAccessToken(user)

        return res.json({
            success: true,
            message: "Access token regenerated successfully!",
            accessToken,
            refreshToken
        })
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const getSession = async (req: Request, res: Response) => {
  try {

    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        throw tryError("Invalid session",401)
    }

    const session = await jwt.verify(accessToken, process.env.AUTH_SECRET!)
    return res.json({
        success: true,
        session
    })

  } catch (error) {
    return catchError(error, res)
  }
}


// export const getUserProfile = async (req: SessionInterface, res: Response) => {
//   try {

//     const {role, id} = req.session!

//     if(role !== "USER"){
//         throw tryError("Unauthorized access", 403)
//     }

//     const userData = await UserModel.findById(id)

//     return userData

//   } catch (error) {
//     return catchError(error, res)
//   }
// }


