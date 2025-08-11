import { Router } from "express";
import { UpdateMetaData } from "../../types/index.js";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user.js";
import { use } from "react";

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
        return
    }
    try {
        // console.log('user id',req.userId);
        await client.user.update({
            where:{
                id:req.userId
            },data:{
                avatarId:parseData.data?.avatarId
        }
       }) 
       res.json({message: "Metadata updated"})
       return
    } catch (e) {
        res.status(400).json({
            message:"failed to update metadata"
        })
    }
})
userRouter.get('/metadata/bulk',async(req,res)=>{
    const userString=(req.query.ids ?? "[]") as string;
    const userIds=(userString).slice(1,userString?.length-1).split(',')
    console.log(userIds,'user string');
    const metadata=await client.user.findMany({
        where:{
            id:{
                in:userIds
            }
        },select:{
            avatar:true,
            id:true
        }
    })
    res.json({
        avatar:metadata.map(m=>({
            userId:m.id,
            avatarId:m.avatar?.imageUrl
        }))
    })
})