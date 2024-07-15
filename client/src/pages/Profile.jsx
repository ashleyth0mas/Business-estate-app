import React,{useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import { updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutUserStart,signoutUserSuccess,signoutUserFailure } from '../redux/user/userSlice';
import { app } from '../firebase';
import {Link} from 'react-router-dom';
const Profile = () => {
  const fileRef=useRef(null)          
  const {currentUser,loading,error}=useSelector((state)=>state.user)
  const [file,setFile]=useState(undefined)
  const [fileper,setFilePer]=useState(0)
  const [listingError,setListingError]=useState(false)
  const [listing,setListing]=useState(false)
  const[userListing,setUserListing]=useState([])
  const [uploadError,setUploadError]=useState(false)
 const [formData,setFormData]=useState({})
 const [uploadSuccess,setUploadSuccess]=useState(false)
 const dispatch=useDispatch()
  console.log(file)
  console.log(formData)
  console.log(fileper)
  
  const handleChange=(e)=>{
    setFormData({
      ...formData,  
      [e.target.id]:e.target.value
    })
  }
  
  const handleSubmit=async(e)=>{
    e.preventDefault()  
    try{
      dispatch(updateUserStart())
      const res=await fetch(`/api/user/update/${currentUser._id}`,
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData)
      }
      )
      const data= await res.json()
      console.log(data)
      if (data.success==false){
        dispatch(updateUserFailure(data.message))
        setUploadSuccess(false)
        return
      }
     
      dispatch(updateUserSuccess(data))
      setUploadSuccess(true)
    }
   catch(error){
    dispatch(updateUserFailure(error.message))
    setUploadSuccess(false)
   }
   
  }
 const handleDeleteUser=async()=>{
  try{
    const res=await fetch(`/api/user/delete/${currentUser._id}`,{
      method:'DELETE'
    })
    const data=await res.json()
  
    if(data.success==false)
      dispatch(deleteUserFailure(data.message))
    dispatch(deleteUserSuccess())
  }
 
 catch(error){  
  dispatch(deleteUserFailure(error.message))
 }

 }

 const handleSignOut=async()=>{
  try{
    const res=await fetch('/api/auth/signout',{
      method:'GET'
    })
    const data=await res.json()
    if(data.success==false)
      return dispatch(signoutUserFailure(data.message))

    dispatch(signoutUserSuccess())
  }
catch(error){
  dispatch(signoutUserFailure(error.message))
}
 }
    
  useEffect(()=>{              
    if(file){
      handleFileUpload(file)
    }
  },[file]);
  const handleFileUpload=(file)=>{
    const storage= getStorage(app);
    const fileName=new Date().getTime()+file.name;
    const storageRef=ref(storage,fileName)
    const uploadTask=uploadBytesResumable(storageRef,file)


    uploadTask.on('state_changed',
    
    (snapshot)=>{                        
      

      
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePer(Math.round(progress))
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    
    (error)=>{                            //func 2
setUploadError(true)
    },

  ()=>{                                  //func 3
    getDownloadURL(uploadTask.snapshot.ref).then((     
      downloadURL)=>{
        setFormData({...formData,avatar:downloadURL})
      }
    )
  });
  setUploadError(false)
 }

 const handleListing=async()=>{
 try{
  setListing(true)
  setListingError(false)
  const res=await fetch(`/api/user/listings/${currentUser._id}`,
    {
     method:'GET',
     })
     const data=await res.json()
     console.log('userlistings',data)
     
     if (data.success==false){
      setListing(false)
      return setListingError(data.message)
      
     }
     setUserListing(data)
    
   }
 catch(error){
  setListingError(error.message)
  setListing(false)
 }
 }

 const handleListDelete=async(listingid)=>{
  try{
    const res= await fetch(`/api/listing/deletelist/${listingid}`,{
      method:'DELETE'
    })
    const data=await res.json()
    if (data.success==false){
      return (data.message)
    }
    setUserListing((prev) =>
      prev.filter((listing) => listing._id != listingid)
    );
  } catch(error){
console.log(error.message)
  }
 
  
 }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center py-4">Profile </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'> 
       <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'></input>   {/*ref={fileRef} creates a reference to the input element, allowing you to access and manipulate it programmatically. After this assignment, fileRef.current will point to the DOM node representing this input element. Once you've assigned the ref to the input element, you can access it via fileRef.current.With the fileRef.current reference, you can access properties and methods of the file input element*/}
        <img onClick={()=>fileRef.current.click()} className="rounded-full h-24 w-24 self-center object-cover cursor-pointer mx-auto mt-3 mb-4" src={ formData.avatar||currentUser.avatar} alt='profileimg'></img>

        <p className='self-center'> 
          {uploadError ? (<span className='text-red-700'>Error in uploading image</span>):(fileper >0 && fileper<100 ? (<span className='text-green-600'>Uploading Image {fileper}%</span>):fileper==100 ? <span className='text-green-600'>Image Uploaded!</span>:null)}
        </p>

        <input defaultValue={currentUser.username} onChange={handleChange} type="text" id='username' placeholder='username' className='rounded-lg p-3 border  self-center w-1/3'></input>
        <input defaultValue={currentUser.email}  onChange={handleChange} type="email" id='email' placeholder='email' className='rounded-lg p-3 border self-center  w-1/3'></input>
        <input   onChange={handleChange} type="password" id='password'   placeholder='password' className='rounded-lg p-3 border self-center  w-1/3'></input>
      <button className='bg-slate-700 rounded-lg mx-auto p-3 w-1/3 text-white uppercase hover:opacity-95'>
        {loading? 'LOADING...': 'UPDATE'}</button>
        <Link className='bg-green-700 p-3 text-center uppercase text-white rounded-lg mx-auto w-1/3' to='/create-listing'>create listing</Link>
      </form>
    
 
      <div className='flex justify-between mx-auto mt-2 w-1/3'>
      <span  onClick={handleDeleteUser} className='text-red-700 cursor-pointer font-semibold'> Delete Account </span>
      <span onClick={handleSignOut} className='text-red-700 cursor-pointer font-semibold'> Sign Out </span>
      </div>
      <div>
      {uploadSuccess? <p className='text-green-700 mt-7 font-semibold text-center'>Profile Updated Successfully</p>:null}
      {error? <p className='text-violet-700 mt-7 font-semibold text-center'>{error}</p>:null }
      {!listing? <p onClick={handleListing} className='text-green-700 mt-7 uppercase text-center font-semibold cursor-pointer  '>Show Listings</p>:<p className='text-black mt-7 text-2xl capitalize font-semibold text-center'>Your listings</p> }
     {userListing && userListing.length>0 && (
      <div className='flex flex-col gap-4 mt-7 w-1/3 mx-auto'>
        {userListing.map((listing)=>(
        
  <div key={listing._id} className='flex border p-3 rounded-lg shadow-md items-center justify-between'>
   <Link to={`/listing/${listing._id}`}>
    <div className='flex items-center '>
    <img src={listing.imageUrls[0]} alt='cover image' className='w-24 h-16  rounded-lg'></img>
            <span className='font-semibold ml-3 hover:underline truncate'>{listing.name}</span>
    </div>
    </Link>  
            <div className='flex flex-col'>
              <button onClick={()=>handleListDelete(listing._id)} className='text-red-700 uppercase cursor-pointer'>delete</button> 
             <Link to={`/update-listing/${listing._id}`}>
             <button className=' pt-1 text-green-700 uppercase'>Edit</button> 
             </Link>
             
            </div>

            </div>
           
          
        

        ))}
      </div>
     )}

      </div>
      
      
    </div>
  )
}

export default Profile
