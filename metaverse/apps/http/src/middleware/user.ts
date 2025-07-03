
import {NextFunction, Request,Response} from 'express'
import jwt from 'jsonwebtoken';
import { JWTPASSWORD } from '../config.js';

type JWTpayload={
    userId:string,
    avatarId:string,
    exp?:number,
    iat?:number
}
export const userMiddleware=(req:Request,res:Response,Next:NextFunction)=>{
    const token=req.headers['authorization']?.split(' ')[1]
    console.log(token);
    if (!token){
        res.status(404).json({
            message:"Token not found"
        })
        return
    }
    console.log(token,'token');
    try {
        const decoded=jwt.verify(token,JWTPASSWORD) as {userId:string ,avatarId:string}
        req.userId=decoded.userId
        Next()
    } catch (e) {
        res.status(401).json({
            message:"unAuthorized"
        })
    }
}