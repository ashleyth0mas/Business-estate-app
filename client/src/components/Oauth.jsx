import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';  
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {signInFailure,signInSuccess} from '../redux/user/userSlice.js'
const Oauth = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
      
            const result = await signInWithPopup(auth, provider);
            console.log(result)       //PROVIDES GOOGLE USER DETAILS SUCH AS NAME,EMAIL
            const res= await fetch('/api/auth/google',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({name:result.user.displayName,
                     email:result.user.email,
                     photo:result.user.photoURL})
            })
            const data=await res.json()
            dispatch(signInSuccess(data))
            navigate('/')
          /*  if(data.success==false){
                dispatch(signInFailure(data.message))
            } */
        } 
        catch(error){
            console.log('could not sign in with google', error);
        }
    }; 
  return (
    <div>
        <button  onClick={handleGoogleClick} type="button" className='bg-red-700 hover:opacity-95 text-white p-3 uppercase rounded-lg w-full'>
            Continue with Google
        </button>
    </div>
  );
}

export default Oauth