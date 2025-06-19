import { Router } from "express";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { userRouter } from "./user";


export const router=Router()

// router.put('',(req,res)=>{})
// router.post('',(req,res)=>{})
// router.put('',(req,res)=>{})
// router.delete('',(req,res)=>{})

router.post('/signup',(req,res)=>{
    res.send({
        message:'signup'
    })
})

router.post('/signin',(req,res)=>{
    res.send({
        message:'signin'
    })
})

router.use('/user',userRouter)
router.use('/admin',adminRouter)
router.use('/space',spaceRouter)