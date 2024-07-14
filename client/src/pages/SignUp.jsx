import React from 'react'
import { useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import Oauth from '../components/Oauth';
const SignUp = () => {
  const [formData,setFormData]=useState({})  //useState hook to initialize a state variable (A state variable is a variable( can be obj,num,array) that holds data representing the state of a component at any given time. ) formData as an empty object {} and a corresponding function setFormData to update this state variable.
 // const {loading,error}=useSelector((state)=>state.user)   //useSelector= to extract data from the Redux store within your React components. This function takes the entire Redux state object as its argument and returns the specific part of the state you want to access. user is the name of the slice inside which we defined the states
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
        const response=await fetch('/api/auth/signup',{            //fetch('/api/auth/signup', ...): It initiates a request to the specified URL (/api/auth/signup) on the server.The fetch in JavaScript is used to initiate both GET and POST requests to a given URL
               //fetch returns a Promise (promise refers to an object that represents the eventual completion{if completed it returns a Response object otherwise throws error} (or failure) of an asynchronous operation) 
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)    //The body of the request, which contains the form data (formData) converted to a JSON string using JSON.stringify()
        })
          // console.log(response)             //returns response object if fetch is successful     
          const data=await response.json()  //extract json data from response object      
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