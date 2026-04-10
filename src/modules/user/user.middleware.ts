import { NextFunction, Response } from "express";
import  jwt, { JwtPayload } from "jsonwebtoken";
import { SessionInterface } from "./user.interface";
import { catchError, tryError } from "../../utils/serverErrorhandler";


export const AuthMiddleware = async(req: SessionInterface, res:Response, next:NextFunction)=>{
    try {
        const accessToken = req.cookies.accessToken as string

        if(!accessToken){
            throw tryError("Failed to authorize user",401)
        }

        const payload = await jwt.verify(accessToken, process.env.AUTH_SECRET!) as JwtPayload
        req.session = {
            id: payload.id,
            email: payload.email,
            fullname: payload.fullname,
            role: payload.role
        }
        
        next()
    } catch (error) {
        return catchError(error, res, "Invalid Session");
    }
}