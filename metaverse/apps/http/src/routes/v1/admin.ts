import { Router } from "express";

export const adminRouter=Router()





adminRouter.post('/element',(req,res)=>{
    res.send({
        message:"element"
    })
})

adminRouter.put('/element/:elementId',(req,res)=>{
    res.send({
        message:"element/:elementId"
    })
})

adminRouter.post('/avatar',(req,res)=>{
    res.send({
        message:"avatar"
    })
})
adminRouter.post('/map',(req,res)=>{
    res.send({
        message:"map"
    })
})