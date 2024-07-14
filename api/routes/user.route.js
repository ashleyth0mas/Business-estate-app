import express from 'express';
import { test } from '../controllers/user.controller.js';
import { updateUser,deleteUser,getUserListing } from '../controllers/user.controller.js';
import {verifyToken} from '../utils/verifyUser.js'
const userRouter= express.Router();
userRouter.get('/test',test); //this is the endpoint url of the router specified in index.js. Here the endpoint action/ response is given as a function(test) and this function is specified inside the controllers
userRouter.post('/update/:id',verifyToken,updateUser)
userRouter.delete('/delete/:id',verifyToken,deleteUser)
userRouter.get('/listings/:id',verifyToken,getUserListing)

export default userRouter;

