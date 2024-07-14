import express from 'express';
import { signup,signin,google,signout } from '../controllers/auth.js';
const authRouter= express.Router();
authRouter.post('/signup',signup);
authRouter.post('/signin',signin);
authRouter.post('/google',google);
authRouter.get('/signout',signout)
export default authRouter;




/*

If you have a request to api/auth/signup, here's what will happen based on the provided code:

The Express application (app) will receive the request.
Since you have registered authRoute middleware using app.use('/api/auth', authRoute), Express will pass the request to authRoute for further processing because the request path starts with /api/auth.
Within the authRoute router middleware, there is a route handler defined for the POST method and the /signup endpoint. This handler is associated with the signup function imported from the ../controllers/signup.js file.
The signup function will be invoked, passing the request and response objects as arguments. This function will contain the logic for handling the signup process, such as validating user input, creating a new user account, and sending back an appropriate response.
*/