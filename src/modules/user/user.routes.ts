import { Router } from "express";
import { changePassword, forgotPassword, getSession, login, logOut, refreshToken, resendOtp, signup, verifyOtp } from "./user.controller";

const UserRouter = Router()

UserRouter.post('/signup',  signup)
UserRouter.post('/login',  login)
UserRouter.get('/logout', logOut)
UserRouter.post('/verify-otp', verifyOtp)
UserRouter.post('/resend-otp', resendOtp)
UserRouter.post('/forgot-password', forgotPassword)
UserRouter.post('/change-password', changePassword)
UserRouter.get("/refresh-token", refreshToken)
UserRouter.get('/session', getSession)
// UserRouter.get('/user-profile', AuthMiddleware, getUserProfile) 

export default UserRouter