import React from 'react'
import { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingCard from '../components/ListingCard'
const Search = () => {
  const [sidebarData,setsidebarData]=useState({
    searchTerm:'',
    type:'all',
    parking:false,
    offer:false,
    furnished:false,
    sort:'createdAt',
    order:'desc'
  })
const [loading,setLoading]=useState(false)
const [listings,setListings]=useState(null)
const [showMore,setShowMore]=useState(false)
const navigate=useNavigate()
  const handleChange=(e)=>{

   
    if(e.target.id=='searchTerm'){
      setsidebarData({...sidebarData,searchTerm:e.target.value}) //{} enclose with these brackets coz the useState is an object
    }

    else if(e.target.id=='all' ||e.target.id=='rent' ||e.target.id=='sale'){
      setsidebarData({...sidebarData,type:e.target.id})
    }

    else if(e.target.id=='parking'||e.target.id=='offer'||e.target.id=='furnished'){
      setsidebarData({...sidebarData,[e.target.id]:e.target.checked||e.target.checked=='true'?true:false})  //e.target.checked=='true'?true:false is used to convert string to boolean. alse [e.target.id] is used to dynamically change the key of the object based on the id of the checkbox.(use () brackets to enclose the key value pair)
    }

    else if(e.target.id=='sort_order'){
      setsidebarData({...sidebarData,sort:e.target.value.split('_')[0]||'createdAt',order:e.target.value.split('_')[1]||'desc'})
    }
    //ONE WAY(pov:u get this by copilot bahahaha...)

   /* e.preventDefault()
    const searchTerm=document.getElementById('searchTerm').value
    const type=document.getElementById('all').checked?'all':document.getElementById('rent').checked?'rent':document.getElementById('sale').checked?'sale':'offer'
    const parking=document.getElementById('parking').checked
    const offer=document.getElementById('offer').checked
    const furnished=document.getElementById('furnished').checked
    const sort_order=document.getElementById('sort_order').value
    const sort=sort_order.split('_')[0]
    const order=sort_order.split('_')[1]
    setsidebarData({
      searchTerm,
      type,
      parking,
      offer,
      furnished,
      sort,
      order
    })*/
console.log(sidebarData)
  }
 
  
 useEffect(()=>{                //used to make changes to the sidebar with the changes in the url
    const urlParams=new URLSearchParams(window.location.search)
    setsidebarData({
      searchTerm:urlParams.get('searchTerm')||'',
      type:urlParams.get('type')||'all',
      parking:urlParams.get('parking')=='true'?true:false,
      offer:urlParams.get('offer')=='true'?true:false,
      furnished:urlParams.get('furnished')=='true'?true:false,
      sort:urlParams.get('sort')||'createdAt',
      order:urlParams.get('order')||'desc'
    })

    const fetchListings=async()=>{
      //const response=await fetch(`/api/listing/get?searchTerm=${sidebarData.searchTerm}&type=${sidebarData.type}&parking=${sidebarData.parking}&offer=${sidebarData.offer}&furnished=${sidebarData.furnished}&sort=${sidebarData.sort}&order=${sidebarData.order}`)
      //OR
      setLoading(true)
      const searchQuery=urlParams.toString()   
      const response=await fetch(`/api/listing/get?${searchQuery}`)
      const data=await response.json()
      console.log(data)
   if(data){
    setListings(data)
    setLoading(false)
   }
   if(data.length>8){
    setShowMore(true)
   }
      
    
    }
    fetchListings()
  },[location.search])

  const handleSubmit=(e)=>{       //this is used to set the url when we make changes in the sidebar and clicks on the search button
    e.preventDefault()
    const urlParams=new URLSearchParams()
    urlParams.set('searchTerm',sidebarData.searchTerm)
    urlParams.set('type',sidebarData.type)
    urlParams.set('parking',sidebarData.parking)
    urlParams.set('offer',sidebarData.offer)
    urlParams.set('furnished',sidebarData.furnished)  
    urlParams.set('sort',sidebarData.sort)
    urlParams.set('order',sidebarData.order)
    const searchQuery=urlParams.toString()
    navigate(`/search?${searchQuery}`) 

  }

const onClickMore=async()=>{
  setShowMore(false)
  const numberOfListings=listings.length
  const startIndex=numberOfListings
  const urlParams=new URLSearchParams(window.location.search)
  urlParams.set('startIndex',startIndex)
  const searchQuery=urlParams.toString()
  const res=await fetch(`/api/listing/get?${searchQuery}`)
  const data=await res.json()
  if(data.length>8){
  setShowMore(true)
  }
  
  setListings([...listings,...data])
}

  return (
        <div className='flex flex-col md:flex-row'>
    <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen '>
      <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
        <div className='flex items-center gap-2'>
          <label className='whitespace-nowrap font-semibold'>
            Search Term:
          </label>
          <input
            type='text'
            id='searchTerm'
            placeholder='Search...'
            className='border rounded-lg p-3 w-full'
           value={sidebarData.searchTerm}
            onChange={handleChange}
          />
        </div>
        <div className='flex gap-2 flex-wrap items-center'>
          <label className='font-semibold'>Type:</label>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='all'
              className='w-5'
              onChange={handleChange}
              checked={sidebarData.type=='all'}
            /> 
            <span>Rent & Sale</span>
          </div>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='rent'
              className='w-5'
              onChange={handleChange}
              checked={sidebarData.type === 'rent'} 
            />
            <span>Rent</span>
          </div>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='sale'
              className='w-5'
              onChange={handleChange}
              checked={sidebarData.type === 'sale'}
            />
            <span>Sale</span>
          </div>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='offer'
              className='w-5'
              onChange={handleChange}
              checked={sidebarData.offer}
            />
            <span>Offer</span>
          </div>
        </div>
        <div className='flex gap-2 flex-wrap items-center'>
          <label className='font-semibold'>Amenities:</label>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='parking'
              className='w-5'
              
              onChange={handleChange}
          
              checked={sidebarData.parking}   //parking,offer,furnished are boolean values hence checked is either true or false (different from type)
            />
            <span>Parking</span>
          </div>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='furnished'
              className='w-5'
              onChange={handleChange}
              checked={sidebarData.furnished}
            />
            <span>Furnished</span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <label className='font-semibold'>Sort:</label>
          <select
           value={`${sidebarData.sort}_${sidebarData.order}`}
           id='sort_order'                           
           className='border rounded-lg p-3'
           onChange={handleChange} 
          > 
            <option value='regularPrice_desc'>Price high to low</option>
            <option value='regularPrice_asc'>Price low to hight</option>
            <option value='createdAt_desc'>Latest</option>
            <option value='createdAt_asc'>Oldest</option>
          </select>
        </div>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
          Search
        </button>
      </form>
    </div>
    <div className='flex-1'>
      <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
        Listing results:
      </h1>
      {loading && <p className='text-center mt-6 font-semibold text-md'>Loading...</p> }
      {!loading && listings && listings.length==0 && <p className='text-center mt-6 font-semibold text-md'>No Listings Found!!</p> }
     <div className='flex flex-wrap'>
        {listings && listings.map((listing)=>(
        
        <ListingCard key={listing._id} listing={listing}/>
              
                
          ))}
     </div>
    
      
      {showMore &&
    <button onClick={onClickMore} className='text-green-700 w-full text-center text-md hover:underline font-semibold'>Show more</button>}
    </div>

  </div>
);
}

export default Search