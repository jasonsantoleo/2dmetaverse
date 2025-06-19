import { Router } from "express";

export const spaceRouter=Router()

// spaceRouter.get('',(req,res)=>{})
// spaceRouter.put('',(req,res)=>{})
// spaceRouter.post('',(req,res)=>{})
// spaceRouter.delete('',(req,res)=>{})

spaceRouter.get('/space/:spaceId',(req,res)=>{
    res.send({
        message:"/space/spaceId"
    })
})

spaceRouter.post('space/element',(req,res)=>{
    res.send({
        message:'space/element'
    })
})

spaceRouter.delete('space/element',(req,res)=>{
    res.send({
        message:'space/element'
    })
})
