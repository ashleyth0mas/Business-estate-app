import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const test=(req,res)=>{
    res.send('Hello World!!')
    };

    export const updateUser = async (req, res, next) => {
        // Check if the authenticated user's ID matches the ID in the request parameters
        if (req.user.id !== req.params.id)
          return next(errorHandler(401, 'You can only update your own account!'));
      
        try {
          // If the request body contains a password, hash it using bcryptjs
          if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
          }
      
          // Update the user document in the database using the provided ID
          const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
              },
            },
            { new: true } // Return the updated document after the update operation
          );
      
          // Exclude the 'password' field from the updated user document
          const { password, ...rest } = updatedUser._doc;
      
          // Send a JSON response with the updated user data (excluding password)
          res.status(200).json(rest);
        } catch (error) {
          // Forward any errors to the error handling middleware
          next(error);
        }
      };
      
  export const deleteUser=async(req,res,next)=>{
    if(req.user.id!=req.params.id){
    return  next(errorHandler(500,'You cannot delete other user'))
    }
    try{
      await User.findByIdAndDelete(req.params.id)
      res.clearCookie('access_token')
      res.status(200).json('User has been deleted')
    }
    catch(error){
      next (error)
    }
  }

  export const getUserListing=async(req,res,next)=>{

    if (req.params.id ==req.user.id){
    
    
    try{
     const listing= await Listing.find({userRef:req.params.id})
     res.status(200).json(listing)  
    }
    catch(error){
      next(error)
    }
  }
  else{
    return next(errorHandler(500,'You cannot access other user listing'))
  }
  }