import express from 'express'
import {createList,deleteList,updateList,getListInfo,getUser,getListings} from '../controllers/listing.controller.js'
import { verifyToken } from '../utils/verifyUser.js'
const listingRouter=express.Router()    
listingRouter.post('/createlist',verifyToken,createList)
listingRouter.delete('/deletelist/:id',verifyToken,deleteList)
listingRouter.post('/updatelist/:id',verifyToken,updateList)
listingRouter.get('/getlist/:id',getListInfo)
listingRouter.get('/getinfo/:id',verifyToken,getUser)
listingRouter.get('/get', getListings);
export default listingRouter