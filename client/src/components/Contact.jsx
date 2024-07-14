import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Contact = ({ listing }) => {
    const [landlord, setLandlord] = useState(null);
    const [error,setError]=useState(false)
    const [message,setMessage]=useState('')
    const params = useParams();

    const getText=(e)=>{
        setMessage(e.target.value)
    }
    useEffect(() => {
        fetchUser();
    }, [params.listingId]);

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/listing/getinfo/${listing.userRef}`);
            const data = await res.json();
            if(data.success==false){
                setError(true)
                
            }
            setLandlord(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    return (
        <div className='flex flex-col'> 

            {landlord? <p className='ml-12 text-md'>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name}</span></p> : <p>Loading user information...</p>}       {/* Added a conditional check to ensure user (user?) is not null before trying to access user.username.*/}
        <textarea onChange={getText} value={message} id='message' placeholder='Enter your message here...' className='mt-6 w-1/2 ml-12 border rounded-lg p-3 mb-3'></textarea>
        {message &&  <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}  //mailto is a protocol that opens the default email client.   Also here value={message} is initial value of the message(which is empty) and onChange={getText} is the function that sets the value of the message to the text entered by the user
       className='text-white bg-slate-800 p-3 rounded-lg my-6 ml-12 w-1/2 uppercase hover:opacity-90 flex justify-center'>send message
        </Link>}
        
        </div>
    );
};

export default Contact;
