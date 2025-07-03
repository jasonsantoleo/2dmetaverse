import { Router } from "express";
import { UpdateMetaData } from "../../types/index.js";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user.js";

export const userRouter=Router()

// userRouter.get('',(req,res)=>{})
// userRouter.put('',(req,res)=>{})
// userRouter.post('',(req,res)=>{})
// userRouter.put('',(req,res)=>{})
// userRouter.delete('',(req,res)=>{})


userRouter.post('/metadata',userMiddleware,async(req,res)=>{
    const parseData=UpdateMetaData.safeParse(req.body)
    if (!parseData.success){
        res.status(400).json({
            message:'failed parsing metadata'
        })
    }
    try {
       await client.user.update({
        where:{
            id:req.userId
        },data:{
            avatarId:parseData.data?.avatarId
        }
       }) 
    } catch (e) {
        res.status(500).json({
            message:"failed to update metadata"
        })
    }
})
userRouter.get('/metadata/bulk',(req,res)=>{
    res.send({
        message:'metadata/bulk'
    })
})