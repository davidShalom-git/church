import React from 'react'
import { useNavigate } from 'react-router-dom';


const Logout = () => {
    const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');

  }

  return (
    <div>
       <button className='bg-white text-black flex justify-center' onClick={logout}>Logout</button>
    </div>
  )
}

export default Logout