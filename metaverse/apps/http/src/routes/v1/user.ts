import { Router } from "express";

export const userRouter=Router()

// userRouter.get('',(req,res)=>{})
// userRouter.put('',(req,res)=>{})
// userRouter.post('',(req,res)=>{})
// userRouter.put('',(req,res)=>{})
// userRouter.delete('',(req,res)=>{})


userRouter.post('/metadata',(req,res)=>{
    res.send({
        message:'metadata'
    })
})
userRouter.get('/metadata/bulk',(req,res)=>{
    res.send({
        message:'metadata/bulk'
    })
})