import React from 'react'
import {FaSearch} from 'react-icons/fa';
import {Link,useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux'
import { useState,useEffect } from 'react';

const Header = () => {
  const {currentUser}=useSelector((state)=>state.user)

  const [searchTerm,setSearchTerm]=useState('')
  const navigate=useNavigate()

const handleSubmit=(e)=>{
  e.preventDefault()
  const urlParams=new URLSearchParams(window.location.search)  //window.location.search retrieves the query string part of the current URL (everything after the ? symbol).URLSearchParams is a built-in JavaScript object that provides a way to work with the query string of a URL.
  urlParams.set('searchTerm',searchTerm)
  const searchQuery=urlParams.toString()
  navigate(`/search?${searchQuery}`)

}

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);


  return (
    <header className='bg-dark-blue shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'> {/* flex is used to bring items in a row ,by default div items is aligned by column. justify between applies space between items and max-w- applies the space required between as user's need*/}
       <Link to='/'>
        <h1 className='font-bold text-xl flex flex-wrap'>
        <span className='text-light-gray'>Estate</span>
        <span className='text-light-gray'>Ease</span>
             
        </h1>
        </Link>
        <div className='bg-slate-100 items-center p-3 rounded-md w-24 sm:w-96 flex justify-between' >
        
          <form onSubmit={handleSubmit} className='flex flex-row justify-end w-full'>  {/*onSubmit is used with form */}
          <input  onChange={(e)=>setSearchTerm(e.target.value)} value={searchTerm} className='bg-transparent focus:outline-none w-full'  type="text" placeholder='Search....'>
              </input>
              <button>
              <FaSearch/>
              </button>

          </form>
       
        </div>
           
       <ul className='flex gap-6 font-bold'> {/*The gap-4 utility class in Tailwind CSS is used to define the gap between child elements within a flex container*/}
       <Link to='/'>
       <li className='text-light-gray hover:underline hidden sm:inline'>Home</li>
       </Link>
        <Link to='/about'>
        <li className='text-light-gray hover:underline hidden sm:inline'>About</li>
        </Link>
        <Link to='/profile'>
{currentUser ? (<img className='w-8 h-8 rounded-full' src={currentUser.avatar} alt='profile'/>):( <li className='text-slate-700 hover:underline'>SignIn</li>)}
       
        </Link>
        
       </ul>
       </div>
    </header>
  )
}

export default Header