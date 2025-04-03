import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setAuthStatus }) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');  // Remove token
        localStorage.removeItem('authStatus');  // Remove auth flag
        setAuthStatus(false);  // Update state
        navigate('/login');  // Redirect to login page
    };

    return (
        <div>
            <button className="bg-white text-black flex justify-center" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default Logout;