import React from 'react'
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom'
const ListingCard = ({listing}) => {
  return (
       
        <div className='flex flex-col gap-2 bg-white shadow-md hover:shadow-lg rounded-md overflow-hidden p-4 w-full sm:w-[260px] m-6'>
           <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0] } alt={listing.name} className='h-[320px] sm:h-[220px] rounded-md mb-4 object-cover hover:scale-105 transition-scale duration-300'/>
           </Link>
            <h2 className='text-lg font-semibold text-slate-700 '>{listing.name}</h2>
            <div className='flex items-center gap-2'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-500 truncate w-full'>{listing.address}</p>
            </div>
        <p className='text-gray-600 line-clamp-2'>{listing.description}</p>
     
    
        <p className=' text-slate-500 mt-2 font-semibold '>$ {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')} {listing.type=='rent' ?'/ month':''} </p>   {/* toLocaleString('en-US')  is used to convert the number to a string in the format of the current locale (i.e to put commas in thousands nd hundreds place). */}

       <div className='flex gap-4 text-xs font-bold text-slate-700' >
          <p> {listing.bedrooms>1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}</p>

          <p> {listing.bathrooms>1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}</p>

       </div>
        
       
        </div>
   
  )
}

export default ListingCard