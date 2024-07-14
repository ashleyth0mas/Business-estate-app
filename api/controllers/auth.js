import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

import dotenv from "dotenv";    
dotenv.config()
export const signup=async(req,res,next)=>{
    const{username,email,password}=req.body;   //accessing data from post request and assign to variables {username,email,password} (This line is just variable assignment)
    const hashedPassword=bcryptjs.hashSync(password,10);  // to encrypt password (in database)
    const newUser=new User({username,email,password:hashedPassword}); //creating a instance of usermodel and this instance contains the user model entity 
    try{
        await newUser.save();            //saving the user entity to database
        res.status(201).json('User created successfully!!'); //this is returned to fetch call otherwise error
    }
    catch(err){
        next(err);
    }
    
}

export const signin=async(req,res,next)=>{
    const {email,password}=req.body;
    try{
    const validUser=await User.findOne({email})    // to search for a user in the database with the email address provided in the request body.
                                                  //If a user is found matching the email criteria, findOne returns the JavaScript object representation of the entire user document retrieved from the database
    if (!validUser){                               
        return next(errorHandler(404,'User not found!'))
        }
    const validPassword=bcryptjs.compareSync(password,validUser.password)    //bcryptjs.compareSync(password, validUser.password): This line (assuming you're using the bcryptjs library) compares the password entered by the user (password from the request body) with the hashed password stored for the valid user (validUser.password).
    if(!validPassword)
        return next(errorHandler(401,'Wrong credentials!'));
    const token=jwt.sign({email:validUser.email,id:validUser._id},process.env.JWT_SECRET_KEY) //jwt.sign(payload, secretOrPrivateKey, [options, callback]): This function generates a JSON Web Token (JWT) using the provided payload (data to be stored in the token), secret key (used to sign the token), and options (such as the token expiration time).
    const  {password:pass,...rest}=validUser._doc     
    
    /* LINE 34 EXPLANATION
    -----------------------
    Object Destructuring:

The left-hand side (const { password: pass, ...rest } = validUser._doc;) defines a new constant variable named rest and another variable named pass.
The password: pass syntax assigns the value of the password property from validUser._doc to the pass variable. This part is optional; you could use password directly if you don't need a different name.
The ...rest part (...) is the "rest" operator. It captures all remaining properties from validUser._doc (excluding password) and assigns them to the rest object.
    */
    res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)    // sets an HTTP cookie named access_token with the value of the generated JWT (token). Cookies are a common method for storing tokens, particularly JWTs (JSON Web Tokens), in web applications. , the res.cookie() function is indeed used for creating cookies to be sent along with the HTTP response.
    }
    catch(error){
        next(error)
    }
}
export const google=async(req,res,next)=>{
     try{
       
        const user = await User.findOne({ email: req.body.email });
        if(user){
          const {password,...rest}=user._doc               
          const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY)
          res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
        }
        else{   //USER SIGN IN WITH GOOGLE FOR THE FIRST TIME
            const generatedPassword=Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);  // to generate random password ,if the user is signing via google for the first time bcoz our usermodel has a defined structure(username,email,password etc)
            const hashedPassword=bcryptjs.hashSync(generatedPassword,10);
            const newUser=new User({
                username:req.body.name.split(" ").join("").toLowerCase(),  //creating the username from the name extracted from req body ( which is the google account name obtained from google authentication)
                email:req.body.email,
                password:hashedPassword,
                avatar:req.body.photo
            });
            await newUser.save()   
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET_KEY)     
            const {password,...rest} =newUser._doc  
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
        }
     }
     catch(error){
        next(error)
     }
}

export const signout=(req,res,next)=>{
   
    res.clearCookie('access_token').status(200).json('User signed out successfully!!')
}