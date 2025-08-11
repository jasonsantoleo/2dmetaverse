import { Router } from "express";
import { AddElement, CreateSpace, deleteSchema } from "../../types/index.js";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user.js";

export const spaceRouter=Router()

// spaceRouter.get('',(req,res)=>{})
// spaceRouter.put('',(req,res)=>{})
// spaceRouter.post('',(req,res)=>{})
// spaceRouter.delete('',(req,res)=>{})

spaceRouter.post("/",userMiddleware,async(req,res)=>{
    const parseData=CreateSpace.safeParse(req.body)
    if (!parseData.success){
        res.status(400).json({
            message:"Validation Failed"
        })
        return 
    }
    if (!parseData.data.mapId){
        const space=await client.space.create({
            data : {
                name:parseData.data.name,
                width:parseInt(parseData.data.dimension.split("x")[0]),
                height:parseInt(parseData.data.dimension.split("x")[1]),
                creatorId:req.userId!
            }
        })
        res.status(200).json({spaceId:space.id})
        return 
    }
    const map=await client.map.findFirst({
        where : {
            id:parseData.data.mapId
        },select:{
            mapElements:true,
            width:true,
            height:true
        }
    })
    if(!map){
        res.status(400).json({message:"map not found"})
        return
    }
    let space = await client.$transaction(async()=>{
        const Space= await client.space.create({
            data:{
                name:parseData.data.name,
                width:map.width,
                height:map.height,
                creatorId:req.userId!
            }
        })
        await client.spaceElements.createMany({
            data: map.mapElements.map(e=>({
                spaceId:Space.id,
                elementId:e.elementId,
                x:e.x!,
                y:e.y!
            }))
        })
        return Space;
    })
    // console.log("endpoint");
    res.json({spaceId:space.id})
})

spaceRouter.get('/all',userMiddleware,async(req,res)=>{
    const space=await client.space.findMany({
        where:{
            creatorId:req.userId!
        }
    })
    res.json({
        spaces:space.map((e)=>({
            id:e.id,
            name:e.name,
            thumbnail:e.thumbnail,
            dimensions:`${e.width}x${e.height}`
        }))
    })
})
spaceRouter.post('/element',userMiddleware,async(req,res)=>{
    const parseData=AddElement.safeParse(req.body)
    if (!parseData.success){
        res.status(400).json({message:"Validation failed"})
        return
    }

    const space=await client.space.findUnique({
        where:{
            id:parseData.data?.spaceId,
            creatorId:req.userId
        },select:{
            width:true,
            height:true
        }
    })
    if(!space){
        res.status(400).json({message:"space not found"})
        return
    }
    if (parseData.data?.x!<0 || parseData.data?.y!<0 || parseData.data?.x!>space?.width! || parseData.data?.y!>space?.height!){
        res.status(400).json({message:"Point outside of the boundary"})
        return
    }
    await client.spaceElements.create({
        data:{
            spaceId:parseData.data?.spaceId,
            elementId:parseData.data?.elementId,
            x:parseData.data?.x,
            y:parseData.data?.y
        }
    })
    res.json({message:"Element Added successfully"})
})

spaceRouter.post('',async(req,res)=>{})

spaceRouter.delete('/element',userMiddleware,async(req,res)=>{
    // console.log('hit /element endpoint');
    
    const parseData=deleteSchema.safeParse(req.body)
    if (!parseData.success){
        res.status(400).json({message:"validation failed"})
        return 
    }
    const spaceElement=await client.spaceElements.findFirst({
        where:{
            id:parseData.data.id
        },include:{
            space:true
        }
    })
    // console.log(spaceElement?.space,'spacelemenrt space');
    if (!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId){
        res.status(400).json({message:"status not found"})
        return 
    }
    await client.spaceElements.delete({
        where:{
            id:parseData.data.id
        }
    })
    res.json({message:"Element Deleted"})
})

spaceRouter.delete('/:spaceId',userMiddleware,async(req,res)=>{
    // console.log(req.params.spaceId,'spaceId');
    
    const space=await client.space.findUnique({
        where:{
            id:req.params.spaceId
        },select:{
            creatorId:true
        }
    })
    // console.log(space,"space id delete");
    if (!space){
        res.status(400).json({message:"space is not found"})
        return
    }
    if (space.creatorId !== req.userId){
        res.json(403).json({message:"unAuthoized"})
        return
    }
    await client.space.delete({
        where:{
            id:req.params.spaceId
        }
    })
    res.json({message:'space is deleted'})
})
spaceRouter.get('/:spaceId',async(req,res)=>{
    // console.log(req.params.spaceId,'spaceId');
    const space=await client.space.findUnique({
        where:{
            id:req.params.spaceId
        },include:{
            elements:{
                include:{
                    element:true
                }
            }
        }
    })
    // console.log(space,'space find');
    if(!space){
        res.status(400).json({message:"Space ot found"})
        return
    }
    res.json({
        "dimensions":`${space.width}x${space.height}`,
        elements:space.elements.map((e)=>({
            id:e.id,
            element:{id:e.element.id,
            imageUrl:e.element.imageUrl,
            width:e.element.width,
            static:e.element.static},
            x:e.x,
            y:e.y
        })),
    })

})
