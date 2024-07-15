import React,{useState,useEffect,useRef} from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import ListingCard from '../components/ListingCard'
const Home = () => {
  SwiperCore.use([Navigation])
  const exploreRef = useRef(null);
  const [showMoreOffer,setShowMoreOffer]=useState(false)
  const [showMoreRent,setShowMoreRent]=useState(false)
  const [showMoreSale,setShowMoreSale]=useState(false)
  const {currentUser}=useSelector((state)=>state.user)
  const [offerListings,setOfferListings]=useState(null)
  const [rentListings,setRentListings]=useState(null)
  const [saleListings,setSaleListings]=useState(null)

  useEffect(()=>{
    fetchOfferListings()
  
  },[])
  const fetchOfferListings=async()=>{
    try{
      const response=await fetch('/api/listing/get?offer=true&limit=4')
      const data=await response.json()
      setOfferListings(data)
      fetchRentListings()
      if(data.length>4){
        setShowMoreOffer(true) 
      }

    }
    catch(error){
      console.log(error)
    }

  }
  const fetchRentListings=async()=>{
    try{
      const response=await fetch('/api/listing/get?type=rent&limit=4')
      const data=await response.json()
      setRentListings(data)
      fetchSaleListings()
      if(data.length>3){
        setShowMoreRent(true) 
      }
    }
    catch(error){
      console.log(error)
    }
  }
  const fetchSaleListings=async()=>{
    try{
      const response=await fetch('/api/listing/get?type=sale&limit=4')
      const data=await response.json()
      setSaleListings(data)
      if(data.length>3){
        setShowMoreSale(true) 
      }
    }
    catch(error){
      console.log(error)
    }
  }

  const handleScrollToExplore = () => {
    if (exploreRef.current) {
      exploreRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
{/*top sec */}
<div>
  <div className='mt-[130px] ml-24'>
    <h1 className='text-slate-800 font-bold text-3xl lg:text-5xl'>Find your <span className='text-slate-600'>perfect </span>home with ease</h1>
    <br/>
        <p className='text-slate-600 font-semibold text-2xl'>Search from over 1000+ properties</p>
        <p className='text-slate-600 mt-2 text-xs sm:text-sm w-1/2' > Simplify your real estate journey with Estate Ease. Whether you're looking to buy, rent, or sell properties, Estate Ease offers a seamless and user-friendly platform to explore a wide range of listings</p>
        <br/>

        {currentUser? 
        <button  onClick={handleScrollToExplore} className=' text-blue-900 font-bold text-xl p-3 rounded-lg uppercase hover:opacity-95'>Let's Explore...</button>
        : <Link to='/sign-in'>
        <button className='bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95'>Get Started</button>
        </Link>}
    
</div>
  

</div>
{/*swiper sec */}
<Swiper navigation>
{offerListings && 

offerListings.map((listing)=>(
  <SwiperSlide key={listing._id}>
    <div
    className='h-[550px] mt-12'
    style={{
      background: `url(${listing.imageUrls[0]}) center no-repeat`,
      backgroundSize: 'cover',
    }}
  ></div>
  </SwiperSlide>
))}

  </Swiper>



{/*listing sec_OFFER */}

 <div className='p-8 ml-12'>
  <h1 ref={exploreRef} className='ml-2 text-3xl text-slate-800 font-semibold border-b-2 w-4/5  p-3 '>Recent Offers</h1>
  <Link to='/search?type=offer'>
  {showMoreOffer &&   <p className='ml-7  text-green-600 font-semibold mt-2 hover:underline'>Showmore...</p> }
  </Link>
  <div className='flex'>
    {offerListings && offerListings.map((listing)=>(
 <ListingCard listing={listing} />
    ))}
  </div>
 </div>
 <div className='p-8 ml-12'>
  <h1  className='ml-2 text-3xl text-slate-800 font-semibold border-b-2 w-4/5  p-3 '>Recent Sale</h1>
  <Link to='/search?type=sale'>
  {showMoreSale &&   <p className='ml-7  text-green-600 font-semibold mt-2 hover:underline'>Showmore...</p> }
</Link>
  <div className='flex'>
    {saleListings && saleListings.map((listing)=>(
 <ListingCard listing={listing} />
    ))}
  </div>
 </div>
 <div className='p-8 ml-12'>
  <h1 className='ml-2 text-3xl text-slate-800 font-semibold border-b-2 w-4/5  p-3 '>Recent Rent</h1>
  <Link to='/search?type=rent'>
  {showMoreRent &&   <p className='ml-7  text-green-600 font-semibold mt-2 hover:underline'>Showmore...</p> }
  </Link>

  <div className='flex'>
    {rentListings && rentListings.map((listing)=>(
 <ListingCard listing={listing} />
    ))}
  </div>
 </div>
</div>
  )  
}

export default Home


