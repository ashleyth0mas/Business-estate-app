import React from 'react'
import { useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import Oauth from '../components/Oauth';
const SignUp = () => {
  const [formData,setFormData]=useState({})  
 // const {loading,error}=useSelector((state)=>state.user)   
  const[error,setError]=useState(null)
  const[loading,setLoading]=useState(false)  

  const navigate=useNavigate()
  const dispatch=useDispatch()
  const handleChange=(e)=>{
    setFormData({
       
        ...formData,    
        [e.target.id]:e.target.value})
  }
const handleSubmit=async(e)=>{
    e.preventDefault()
    try{ 
      setLoading(true)
       // dispatch(signInStart())          
        const response=await fetch('/api/auth/signup',{

            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
        })
          // console.log(response)
          const data=await response.json()  
          if (data.success==false){
            setLoading(false)
            setError(error.message) 
          //dispatch(signInFailure(data.message))
          return
    }       
    console.log(data)
       setLoading(false)          //dispatch(signInSuccess(data))     
    navigate('/sign-in') 
     }
    catch(error)       {
        
        //dispatch(signInFailure(error.message))
       setLoading(false)
        setError(error.message) 
    }
}

console.log(formData)
  return (
    <div className='mt-7 max-w-lg mx-auto p-3'>  {/* max-w-lg = used to set max width of widget ensuring the content doesn't extend beyond a certain width on larger screens. */}
        <h1 className='text-3xl font-semibold text-center'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col my-10 gap-6'>
            <input type="text" placeholder='username' className='border rounded-lg p-3' id='username' onChange={handleChange}/>
            <input type="text" placeholder='email' className='border rounded-lg p-3' id='email' onChange={handleChange}/>
            <input type="password" placeholder='password' className='border rounded-lg p-3' id='password' onChange={handleChange}/>
            <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>{loading ? 'Loading...' :'SignUp'}</button>
    <Oauth/>
        </form>
        <div className='flex gap-2'>
            <p>Have an account?</p>
            <Link to={"/sign-in"}>
                <span className='text-blue-700'>Sign in</span>
            </Link>
             
        </div>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignUp
