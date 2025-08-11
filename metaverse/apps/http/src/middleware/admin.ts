import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTPASSWORD } from "../config.js";
export const adminMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const headers=req.headers["authorization"]
    const token=headers?.split(" ")[1]
    if(!token){
        res.status(403).json({
            message:"Not Authorized"
        })
    }
    try {
        // const decoded=jwt.verify(token,JWTPASSWORD) as {role:string,userId:string}
    } catch (error) {
        
    }
}