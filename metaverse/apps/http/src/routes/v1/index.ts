import { Router } from "express";
import { adminRouter } from "./admin.js";
import { spaceRouter } from "./space.js";
import { userRouter } from "./user.js";
import { SignInSchema, SignUpSchema } from "../../types/index.js";
import bcrypt from 'bcrypt';
import client from '@repo/db/client'
import jwt from "jsonwebtoken";
import { JWTPASSWORD } from "../../config.js";



export const router=Router()
// router.put('',(req,res)=>{})
// router.post('',(req,res)=>{})
// router.put('',(req,res)=>{})
// router.delete('',(req,res)=>{})


const SALT_ROUNDS = 12;
// Hash password
async function hashPassword(password:any){
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
async function verifyPassword(password: any, hash: any){
  return await bcrypt.compare(password, hash);
}

router.get('/',(req,res)=>{
  res.json({
    message:'welcome to metaVerse'
  })
})
  
router.post('/signup',async(req,res)=>{
  console.log(req.body);
    const parseData=SignUpSchema.safeParse(req.body)
    
    if (!parseData.success){
         res.status(400).json({
            message:"failed",
            status:false
        })
        return  
    }
    console.log(parseData|| null)
    const hashedPassword=await hashPassword(parseData.data?.password)
    const user=await client.user.create({
      data:{
        username: parseData.data?.username ?? '',
        password:hashedPassword,
        role: parseData.data?.type === 'Admin' ? 'Admin' : 'User',
      }
    })
    res.status(200).json({
      userId:user?.id
    })
})

router.post('/signin',async(req,res)=>{
  const parseData=SignInSchema.safeParse(req.body)
  console.log(parseData);
  
  if (!parseData.success){
    res.status(400).json({
      message:"failed"
    })
    return 
  }
  try {
    const user=await client.user.findUnique({
      where:{
        username:parseData.data?.username
      }
    })
    if (!user){
      res.status(403).json({
        message:'user not found'
      })
      return 
    }
    
    const compare=await verifyPassword(parseData.data?.password,user.password)
    if (!compare){
      res.status(200).json({
        message:'password mismatch'
      })
      return
    }
    const token=jwt.sign({
      userId:user.id,
      role:user.role
    },JWTPASSWORD)
    res.json({
      token:token
    })
    return
  } catch (e) {
    res.status(500).json({
      message:"problem with either findUser or hashVerify"
    })
  }
})
router.get('/elements',async(req,res)=>{
  const elements=await client.elements.findMany()
  res.json(elements.map(e=>({
    id:e.id,
    imageUrl:e.imageUrl,
    width:e.width,
    height:e.height,
    // static:e.static
  })))
})
router.get('space',async(req,res)=>{
  const space=await client.space.findMany()
  res.json(space.map(s=>({
    id:s.id,
    imageUrl:s.thumbnail,
    name:s.name
  })))
})

router.use('/user',userRouter)
router.use('/admin',adminRouter)
router.use('/space',spaceRouter)