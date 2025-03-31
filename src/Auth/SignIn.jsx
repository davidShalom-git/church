import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cross from '../assets/corss.jpg';

const SignIn = ({ setAuthStatus }) => {
    const [formData, setFormData] = useState({
        Email: "",
        Password: ""
    });

    const navigation = useNavigate();

    const api = "https://church-2.onrender.com/api/auth/login";

    const signIn = async () => {
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
                setAuthStatus(true); // Update authentication state
                navigation('/'); // Redirect to Home
            } else {
                console.log("Login failed: ", data.message || response.statusText);
            }
        } catch (error) {
            console.log("Error during login: ", error);
        }
    };

    const onChangeData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await signIn();
    };

    const navigateToSignUp = () => {
        navigation('/signup'); // Navigate to signup page
    };

    return (
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
                    <h1 className="text-3xl text-white">SignIn</h1>
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
                        SignIn
                    </button>
                </form>
                <button
                    onClick={navigateToSignUp}
                    className="mt-4 bg-transparent border border-white rounded-full py-3 text-white hover:bg-gray-800 hover:text-white transition duration-300 ease-in-out w-full"
                >
                    New User? Sign Up
                </button>
            </div>
        </div>
    );
};

export default SignIn;

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
