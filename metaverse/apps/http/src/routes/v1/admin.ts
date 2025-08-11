import { Router } from "express";
import { CreateAvatar, CreateElement, CreateMap } from "../../types/index.js";
import client from "@repo/db/client";

export const adminRouter=Router()

adminRouter.get('/',(req,res)=>{
    res.json({
      message:'welcome to metaVerse admin'
    })
  })
adminRouter.post('/element',async(req,res)=>{
    const parsedSchema=CreateElement.safeParse(req.body)
    if (!parsedSchema.success){
        res.status(400).json({
            message:"validation failed"
        })
        return
    }
    const element=await client.elements.create({
        data:{
            width:parsedSchema.data.width,
            height:parsedSchema.data.height,
            static:parsedSchema.data.static,
            imageUrl:parsedSchema.data.imageUrl
        }
    })
    res.send({
        id:element.id
    })
})

adminRouter.put('/element/:elementId',(req,res)=>{
    res.send({
        message:"element/:elementId"
    })
})
adminRouter.post('/avatar',async(req,res)=>{
    // console.log(req.body);
    
    const parseData=CreateAvatar.safeParse(req.body)
    if(!parseData.success){
        res.status(400).json({message:"Type Validation Failed"})
        return 
    }
    // console.log(parseData,'parsed data');
    const avatar=await client.avatar.create({
        data:{
            name:parseData.data?.name ,
            imageUrl: parseData.data?.imageUrl
        }
    })
    // console.log(avatar,'avatar');
    
    res.json({avatarId:avatar.id})
})
adminRouter.post('/map',async(req,res)=>{
    // console.log(req.body,'map body');
    
    const parseData=CreateMap.safeParse(req.body)
    if (!parseData.success){
        res.status(400).json({
            message:"validation failed"
        })
        return 
    }
    const Map=await client.map.create({
        data:{
            name:parseData.data.name,
            width:parseInt(parseData.data.dimension.split("x")[0]),
            height:parseInt(parseData.data.dimension.split("x")[1]),
            thumbnail:parseData.data.thumbnail,
            mapElements:{
                create:parseData.data.defaultElements.map(e=>({
                    elementId:e.elementId,
                    x:e.x,
                    y:e.y
                }))
            }
        }
    })
    res.json({
        mapId:Map.id
    })
})