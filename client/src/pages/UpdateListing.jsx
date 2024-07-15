import { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate,useParams } from 'react-router-dom'

import { app } from '../firebase'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
const UpdateListing = () => {
    const params=useParams()
    const {currentUser}=useSelector((state)=>state.user)
    const[loading,setLoading]=useState(false)
    const [error,setError]=useState(false)
    const [files,setFiles]=useState([])
    const navigate=useNavigate()
   const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData,setFormData]=useState({imageUrls:[],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 100,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,})
    console.log(files)
    console.log(formData)
    useEffect(()=>{
        const getListingInfo=async()=>{
         const listingId=params.listingId         
          const res=await fetch(`/api/listing/getlist/${listingId}`)
          
          const data=await res.json()   
          if (data.success==false){
             console.log(data.message)
             return;
          }
          setFormData(data)
        }                                                                                                            
        getListingInfo()
        },[]);  
    const handleImageSubmit=()=>{
        setUploading(true)
        if(files.length>0 && files.length+formData.imageUrls.length <7) {
          
           setImageUploadError(false)
           
   // const promises=[]

  
    for (let i=0;i<files.length;i++){
        
        const storage= getStorage(app)
        const storageRef=ref(storage,`images/${files[i].name}`)
        const uploadTask=uploadBytesResumable(storageRef,files[i])
        uploadTask.on('state_changed',
        (snapshot)=>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },
        (error)=>{
            
            setUploading(false);
            console.log('Image upload failed (2 mb max per image)',error)
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                console.log('File available at', downloadURL);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    imageUrls: [...prevFormData.imageUrls, downloadURL], 
                  }));
                  console.log(formData)
                 
            }) 
           setUploading(false)
        }
        )
       }
    }
        else{
            setImageUploadError('You can only upload 6 images per listing')
            setUploading(false);
            console.log(imageUploadError);
        }
      

    }
    const handleImageDelete=(index)=>{
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
            });
    }

    const handleChange=(e)=>{
   if (e.target.id=='rent' || e.target.id=='sale'){
         setFormData({...formData,type:e.target.id})
   }
   if(e.target.id=='parking' || e.target.id=='furnished' ||e.target.id=='offer'){
    setFormData({...formData,[e.target.id]:e.target.checked})
   }
   if(e.target.type=='number'|| e.target.type=='text' ||e.target.type=='textarea'){
    setFormData({...formData,[e.target.id]:e.target.value})
   }
    }

    

const handleSubmit=async(e)=>{
    
e.preventDefault()

try{
    if (formData.imageUrls.length<1)
        {
            return (setError('You must upload atleast one image'))
        }
        
    if(+formData.regularPrice<+formData.discountPrice){
        return setError('Discounted price must be less than regular price')
    }
    setError(false)
    setLoading(true) 
       
const res=await fetch(`/api/listing/updatelist/${params.listingId}`,{
    method:'POST',
    
    headers:{
        'Content-Type':'application/json',
    },
    body:JSON.stringify({...formData,userRef:currentUser._id})   
})
const data=await res.json()
if(data.success==false){
    setLoading(false)
    return setError(data.message)
}
setLoading(false)
navigate(`/listing/${data._id}`)
}

catch(error){
    setError(error.message)
    setLoading(false)
}
    }

  return (
    <div className='items-center '>
        <h1 className='text-3xl mt-4 text-center font-semibold'>Update a Listing  </h1>

           <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row mt-8 pl-40">
            <div className='mx-auto gap-4 flex flex-col items-center w-3/5'>
            <input onChange={handleChange} value={formData.name} id='name' className='p-3 w-3/5  rounded-lg border' type="text" placeholder='Name' maxLength='62' minLength='10' required></input>
            <input onChange={handleChange} value={formData.description} id='description'  className='pb-8 p-3 w-3/5 border rounded-lg ' type="text" placeholder='Description' maxLength='10000' minLength='10' required></input>
            <input onChange={handleChange} value={formData.address} id='address' className='p-3 w-3/5  rounded-lg border ' type="text" placeholder='Address' maxLength='62' minLength='10' required></input>
            
            <div className='flex flex-wrap w-3/5'> 
            <div className='flex gap-2 pr-8 pb-3'>
                <input onChange={handleChange} checked={formData.type=='sale'} id='sale' className="w-5" type="checkbox"></input>
                <span>Sell</span>
            </div>
            <div className='flex gap-2 pr-8 pb-3'>
                <input onChange={handleChange} checked={formData.type=='rent'} id='rent' className="w-5" type="checkbox"></input>
                <span>Rent</span>
            </div>
            <div className='flex gap-2 pr-8 pb-3'>
                <input onChange={handleChange} checked={formData.parking==true} id='parking' className="w-5" type="checkbox"></input>
                <span>Parking spot</span>
            </div>
            <div className='flex gap-2 pr-14'>
                <input onChange={handleChange} checked={formData.furnished==true} id='furnished' className="w-5" type="checkbox"></input>
                <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
                <input onChange={handleChange} checked={formData.offer==true} id='offer' className="w-5" type="checkbox"></input>
                <span>Offer</span>
            </div>

           </div> 
           <div className='flex '>
           <div className='flex gap-3 items-center pr-32'>
                <input onChange={handleChange} value={formData.bedrooms} id='bedrooms' min= '1' max='10' required className='p-3 w-1/8 border rounded-lg border-gray-200' type="number" ></input>
                <span>Beds</span>
           </div>
           <div className='flex gap-3 items-center pr-4'>
                <input onChange={handleChange} value={formData.bathrooms} id='bathrooms' min= '1' max='10' required className='p-3 w-1/8 border rounded-lg border-gray-200' type="number" ></input>
                <span>Baths</span>
           </div>
           </div>
           <div className='flex gap-3 items-center pr-44'>
                <input onChange={handleChange} value={formData.regularPrice} id='regularPrice' required className='p-3 w-1/8 border rounded-lg border-gray-200' type="number" min='100' max='30000000' ></input>
                <div className='flex flex-col'>
                <span>Regular Price</span>
                <span className='text-xs pt-1' >($/Month)</span>
                </div>
               
           </div>
           {formData.offer && (
   <div className='flex gap-3 items-center pr-36'>
   <input onChange={handleChange} value={formData.discountPrice} id='discountPrice'  required min='0' max='100000000'  className='p-3 w-1/8 border rounded-lg border-gray-200' type="number" ></input>
   <div className='flex flex-col'>
   <span>Discounted Price</span>
   <span className='text-xs pt-1' >($/Month)</span>
   </div>

</div>
           )}
           
           
           </div>
           <div className='w-3/5'>
           <div className='flex '>
           <p className='font-semibold pr-2'>Images:</p>
           <span className='text-gray-600'>The first image will be the cover (max 6)</span>
           </div>
          <div className='flex gap-6'>
            <input onChange={(e)=>setFiles(e.target.files)} className='p-3 w-1/2 border rounded-lg' type="file" multiple accept="image/*"></input>
            
            <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 rounded font-semibold border text-green-700 uppercase border-green-700 hover:shadow-lg disabled:opacity-80'>
                {uploading ? 'uploading...': 'upload'}</button>
          </div>
          {formData.imageUrls.length>0 && formData.imageUrls.map((url,index)=>(

            <div className='pt-4'>
                 <div key={url} className='flex justify-between items-center p-3  border'>
                 <img src={url} alt='listing' className='w-24 h-24 object-cover rounded-lg'></img> 
                 <button onClick={(e)=>handleImageDelete(index)} className='p-6 text-red-700 uppercase font-medium hover:opacity-80'>delete</button>

            {/*When you write onClick={handleImageDelete(index)}, it immediately calls handleImageDelete with the index argument, rather than waiting for the button click to trigger the function.
            By wrapping handleImageDelete(index) in an arrow function, you're providing a function reference that will be called only when the button is clicked. */}
            </div>
            </div>
                             
          ))}
            <button disabled={uploading || loading}  type='submit' className='disabled:opacity-80 bg-slate-700 rounded-lg p-3 mt-6 w-3/4  text-center text-white  uppercase hover:opacity-95'>
                {loading ? 'updating...':'update listing'}</button>
          {error && <p className='pt-3 font-medium text-red-700 text-sm'>{error}</p>}
          {imageUploadError? <p className='text-red-600 mt-3'>{imageUploadError}</p>:null}
         
           </div>
          
      

        
           </form>
         
        </div>
  )
}

export default UpdateListing
