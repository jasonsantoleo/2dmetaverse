import express from 'express'
import {router} from './routes/v1/index.js'
import client from '@repo/db/client'

const app=express()

app.use(express.json())

app.use('/app/v1',router)

app.listen(3000,()=>{
    console.log('listing on 3000'); 
})
