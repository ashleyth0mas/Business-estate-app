//to use import keyword make sure package.json has "type":"module"

//change scripts inside package.json as:
/*  "scripts": {
   "dev":"nodemon api/index.js",
   "start":"node api/index.js"

  }, */

  /*The then() method is used with Promises in JavaScript to handle the successful resolution of a Promise. When a Promise is resolved, the then() method is invoked, allowing you to specify what should happen with the resolved value. 
  Here's the basic syntax:
  myPromise.then((resolvedValue) => {
      // Handle the resolved value here
}).catch((error) => {
      // Handle errors here
});
 */

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser'
import path from 'path';
dotenv.config();

mongoose.connect(process.env.MONGO).then(            
  ()=>{
    console.log("Connected to MongoDb!")
  }
).catch((err)=>{
  console.log(err);
})

const __dirname = path.resolve();    
const app=express();
app.use(express.json());  //to allow json input from client
const port=3000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})

app.use(cookieParser())

app.use('/api/user',userRouter); //to see server response type the server port number in the url
/*app.get('/test',(req,res)=>{
  res.send('Hello World!!')
}); */

app.use('/api/auth',authRouter)
app.use('/api/listing',listingRouter)


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err,req,res,next)=>{
const statusCode=err.statusCode;
const message=err.message ||'Internal server error';
return res.status(statusCode).json({
  success:false,
  statusCode,
  message
});

});