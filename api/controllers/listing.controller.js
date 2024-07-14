import Listing from "../models/listing.model.js"
import User from "../models/user.model.js "
import { errorHandler } from "../utils/error.js"
export const createList=async(req,res,next)=>{
    try{
    const listing=await Listing.create (req.body)   //Listing.create() is a Mongoose method used to create a new document of the Listing model/schema in the MongoDB database.
    res.status(201).json(listing)
    }
    catch(error){
        next(error)
    }
}
export const deleteList=async(req,res,next)=>{
   

try{
  const listing=await Listing.findByIdAndDelete(req.params.id)

  if(req.user.id!=listing.userRef){
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }
  if (!listing){
    return next(errorHandler(404, `Listing not found!!`));
  }
  res.status(201).json(listing)
}catch(error){
    next(error)
}
}

export const updateList=async(req,res,next)=>{
   

  try{
    const listing=await Listing.findByIdAndUpdate(  req.params.id,
      req.body,
      { new: true } 

    )
  
    if(req.user.id!=listing.userRef){
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
    if (!listing){
      return next(errorHandler(404, `Listing not found!!`));
    }
    res.status(201).json(listing)
  }catch(error){
      next(error)
  }
  }

  export const getListInfo=async(req,res,next)=>{
    
  
      try{
        const listing=await Listing.findById(req.params.id)
      
        if (!listing){
          return next(errorHandler(404, `Listing not found!!`));
        }
        res.status(201).json(listing)
        
      }catch(error){
          next(error)
      }

  }

  export const getUser=async(req,res,next)=>{
    try{
      const userinfo= await User.findById(req.params.id)
      //const {password,...rest}=userinfo._doc
      res.status(200).json(userinfo)  
     }
     catch(error){
       next(error)
     }
  }

 export const getListings = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 9;  // Number of items per page
      const startIndex = parseInt(req.query.startIndex) || 0; // Offset for pagination.   startIndex=0: No elements are skipped, so the list starts from the first element.
                                                              //startIndex=1: The first element is skipped, so the list starts from the second element.
  
      let offer = req.query.offer;
     if (offer === 'false' || offer === undefined) {     //If offer is 'false' or not defined, it is set to { $in: [false, true] }, meaning it will match documents where offer can be either false or true
        offer = { $in: [false, true] };
      }
  
      //$in: is particularly used for filtering documents based on whether a field's value is included in a specified list of values [...].

      let furnished = req.query.furnished;
     if (furnished === 'false' || furnished === undefined) {
        furnished = { $in: [false, true] };
      }
  
      let parking = req.query.parking;
     if (parking === 'false' || parking === undefined) {
        parking = { $in: [false, true] };
      }
  
      let type = req.query.type;
      if (type == undefined || type == 'all') {
        type = { $in: ['sale', 'rent'] };
      }
  
      const searchTerm = req.query.searchTerm || '';
      const sortField = req.query.sort || 'createdAt';
      const sortOrder = req.query.order ||'desc'; // Use 1 for ascending and -1 for descending in MongoDB
  
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' }, //case-insensitive filtering . regex used to return all matching listings
        offer,
        furnished,
        parking,
        type,
      })
        .sort({ [sortField]: sortOrder }) // Sort results
        .skip(startIndex)                 // Skip results based on startIndex for pagination
        .limit(limit);                    // Limit number of results per page . skip nd limit is used together to implement pagination
  
      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };
  

  