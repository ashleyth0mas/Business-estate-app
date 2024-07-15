import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import Contact from '../components/Contact'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';

const Listingpg = () => {

const {currentUser}=useSelector((state)=>state.user)
SwiperCore.use([Navigation])

const[listing,setListing]=useState(null)
const[loading,setLoading]=useState(false)
const[error,setError]=useState(false)
const [copied, setCopied] = useState(false);
const [contact,setContact]=useState(false)
const params=useParams()

useEffect(()=>{
    fetchListing()
},[params.listingId])

const fetchListing=async()=>{
    try{
        setLoading(true)
        const response = await fetch(`/api/listing/getlist/${params.listingId}`)
        const data = await response.json()
        if (data.success==false){
            setError(true)
            setLoading(false)
    
            return error
        }
        setLoading(false)
        setListing(data)   
        setError(false)
    }
    catch(error){
        setError(true)
        setLoading(false)
    }
   
}

  return (
    <div>
        {loading && <p className='text-center text-2xl my-7'>Loading...</p>}
        {error && <p className='text-center text-2xl my-7'>Something went wrong!!</p>}
        {listing && !loading && !error && (<div>
            <Swiper navigation>
                {listing.imageUrls.map((url)=>(
                    <SwiperSlide key={url}>
                         <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);      
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
            
            <h1 className='text-2xl ml-12 font-semibold my-7'>{listing.name} - ${listing.offer? listing.discountPrice:listing.regularPrice} {listing.type=='rent'? ' month':''}</h1>
            <div className='flex flex-col ml-12'>
            <p className='flex items-center mb-6 gap-3  text-slate-800 text-md '>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-8 mb-8'>
            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
           

            </div>
            <div className='flex flex-row items-center gap-2 ml-12 my-8 '>
          <FaBed className='text-green-700 text-lg h-6'/> 
          <p className='text-green-700'>{listing.bedrooms>1? `${listing.bedrooms} beds`:`${listing.bedrooms} bed`}</p>
          <FaBath className='text-green-700 text-lg h-6 ml-4'/> 
          <p className='text-green-700'>{listing.bathrooms>1? `${listing.bathrooms} baths`:`${listing.bathrooms} bath`}</p>
          <FaParking className='text-green-700 text-lg h-6 ml-4'/> 
          <p className='text-green-700'>{listing.parking? `Parking spot`:`No Parking`}</p>
          <FaChair className='text-green-700 text-lg h-6 ml-4'/> 
          <p className='text-green-700'>{listing.furnished? `Furnished`:`Unfurnished`}</p>
            </div>
       {currentUser && listing.userRef!=currentUser._id && (
 <div className='flex justify-between items-center'>
 <button onClick={()=>setContact(true)} className='text-white bg-slate-800 w-1/3 uppercase  rounded-lg p-3 mx-auto'>Contact landlord</button>
             </div>
       ) }
        {contact && <Contact listing={listing}/>}
   
         
          
            </div>)}
            
    </div>
  )
}

export default Listingpg
