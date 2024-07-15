import React from 'react'
import { useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice.js'
import { useDispatch,useSelector } from 'react-redux'
import Oauth from '../components/Oauth.jsx'
const SignIn = () => {
  const [formData,setFormData]=useState({})
 const dispatch=useDispatch()
 const {error,loading} = useSelector((state)=>state.user)
 

  const navigate=useNavigate()
  const handleChange=(e)=>{
    setFormData({
       
        ...formData,    
        [e.target.id]:e.target.value})
  }
const handleSubmit=async(e)=>{
    e.preventDefault()
    try{
        dispatch(signInStart())
        
        const response=await fetch('/api/auth/signin',{            

            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)   
        })
          // console.log(response)             
          const data=await response.json()        
          if (data.success==false){
            
             dispatch(signInFailure(data.message))
                         
             return;
         /* setLoading(false)
          setError(data.message) */
          
          }       
    console.log(data)
    
    dispatch(signInSuccess(data)) 
    navigate('/')
     }
    catch(error)       {
     dispatch(signInFailure(error.message))
     
       /* setLoading(false)
        setError(error.message) */
    }
}

console.log(formData)
  return (
    <div className='mt-7 max-w-lg mx-auto p-3'>  {/* max-w-lg = used to set max width of widget ensuring the content doesn't extend beyond a certain width on larger screens. */}
        <h1 className='text-3xl font-semibold text-center'>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col my-10 gap-6'>
          
            <input type="text" placeholder='email' className='border rounded-lg p-3' id='email' onChange={handleChange}/>
            <input type="password" placeholder='password' className='border rounded-lg p-3' id='password' onChange={handleChange}/>
            <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>{loading ? 'Loading...' :'Sign In'}</button>
            <Oauth/>
        </form>
        <div className='flex gap-2'>
            <p>Dont have an account?</p>
            <Link to={"/sign-up"}>
                <span className='text-blue-700'>Sign up</span>
            </Link>
             
        </div>
        {error && <p className='text-red-500 mt-5'>{error} </p>}
        
    </div>
  )
}

export default SignIn
