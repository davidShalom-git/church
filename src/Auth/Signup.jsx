import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import cross from '../assets/corss.jpg'

const Signup = () => {

    const [formData,setFormData] = useState({
        Name: "",
        Email: "",
        Password: ""
    })

    const navigation = useNavigate()

    const api = "https://church-2.onrender.com/api/auth/signup"

    const signup = async () => {
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                navigation('/');
            } else {
                console.log("Signup failed: ", data.message || response.statusText);
            }
        } catch (error) {
            console.log("Error during signup: ", error);
        }
    };

const onChangeData = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
}

const onSubmit = async (e) => {
    e.preventDefault();
    await signup();
};

  return (
    <>

<div
        style={{
            backgroundImage: `url(${cross})`,
            minHeight: '100vh',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
        }}
    >
        <div className="flex flex-col items-center w-full max-w-lg px-8 py-12 overflow-auto" style={glassStyle}>
            <div className="text-center mb-8 p-4 rounded-lg w-full" style={titleStyle}>
                <h1 className="text-3xl text-white">SignUp</h1>
            
            </div>
          
            <form className="flex flex-col w-full" onSubmit={onSubmit}>
                {Object.keys(formData).map((key) => (
                    <input
                        key={key}
                        type={key === "Email" ? "email" : "text"}
                        name={key}
                        value={formData[key]}
                        onChange={onChangeData}
                        placeholder={`Enter your ${key.replace(/([A-Z])/g, ' $1')}`}
                        className="px-4 py-3 rounded-2xl mb-4 w-full border border-white text-white placeholder-white bg-transparent"
                    />
                ))}
                <button className="bg-black rounded-full py-3 text-white hover:bg-gray-800 transition duration-300 ease-in-out w-full">
                    SignUp
                </button>
            </form>
        </div>
    </div>  
    </>
  )
}

export default Signup


const glassStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
};

const titleStyle = {
    borderRadius: '12px',
    padding: '10px 20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
};
