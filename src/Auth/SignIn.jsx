import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cross from '../assets/corss.jpg';

const SignIn = ({ setAuthStatus }) => {
    const [formData, setFormData] = useState({
        Email: "",
        Password: ""
    });
    const [isLoading, setIsLoading] = useState(false); // NEW: Loading state

    const navigation = useNavigate();
    const api = "https://church-fire.vercel.app/api/auth/login";

    const signIn = async () => {
        setIsLoading(true); // Show loading overlay
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
                setAuthStatus(true);
                setTimeout(() => { // Delay navigation for smooth UX
                    setIsLoading(false);
                    navigation('/');
                }, 1500);
            } else {
                setIsLoading(false); // Hide loading overlay on failure
                console.log("Login failed: ", data.message || response.statusText);
            }
        } catch (error) {
            setIsLoading(false);
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
        navigation('/signup');
    };

    return (
        <div style={backgroundStyle}>
            {/* Loading Overlay */}
            {isLoading && (
                <div style={loadingOverlay}>
                    <h2 style={loadingText}>⏳ Please Wait...</h2>
                </div>
            )}

            <div className="flex flex-col items-center w-full max-w-lg px-8 py-12 overflow-auto" style={glassStyle}>
                <div className="text-center mb-8 p-4 rounded-lg w-full" style={titleStyle}>
                    <h1 className="text-3xl text-white">உள்நுழையவும்</h1>
                </div>

                {/* Sign-in Form */}
                <form className="flex flex-col w-full" onSubmit={onSubmit}>
                    {Object.keys(formData).map((key) => (
                        <input
                            key={key}
                            type={key === "Email" ? "email" : key === "Password" ? "password" : "text"}
                            name={key}
                            value={formData[key]}
                            onChange={onChangeData}
                            placeholder={` ${key === "Name" ? "பெயர்" : key === "Email" ? "மின்னஞ்சல்" : "கடவுச்சொல்"}`}
                            className="px-4 py-3 rounded-2xl mb-4 w-full border border-white text-white placeholder-white bg-transparent"
                        />
                    ))}
                    <button className="bg-black rounded-full py-3 text-white hover:bg-gray-800 transition duration-300 w-full">
                        உள்நுழையவும்
                    </button>
                </form>

                <button onClick={navigateToSignUp} className="mt-4 border border-white rounded-full py-3 text-white hover:bg-gray-800 w-full">
                    புதிய பயனர்? பதிவு செய்யவும்
                </button>
            </div>
        </div>
    );
};

export default SignIn;

const backgroundStyle = {
    backgroundImage: `url(${cross})`,
    minHeight: '100vh',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    position: 'relative'
};

// ✅ Loading Overlay
const loadingOverlay = {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 10
};

const loadingText = {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold'
};

const glassStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    position: 'relative'
};

const titleStyle = {
    borderRadius: '12px',
    padding: '10px 20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
};
