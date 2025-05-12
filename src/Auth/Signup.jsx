import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import cross from '../assets/corss.jpg';

const Signup = () => {
    const [formData, setFormData] = useState({
        Name: "",
        Email: "",
        Password: ""
    });

    // New state for validation errors
    const [errors, setErrors] = useState({
        Email: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigate();
    const api = "https://church-fire.vercel.app/api/auth/signup";

    const validateEmail = (email) => {
        // Check if email includes @gmail.com
        if (!email.includes('@gmail.com')) {
            setErrors(prev => ({
                ...prev, 
                Email: "கட்டாயம் Gmail மின்னஞ்சல் பயன்படுத்தவும்!"
            }));
            return false;
        }
        
        // Clear any previous email errors
        setErrors(prev => ({
            ...prev, 
            Email: ""
        }));
        return true;
    };

    const signup = async () => {
        // First validate email
        if (!validateEmail(formData.Email)) {
            return;
        }

        setIsLoading(true);
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
                setTimeout(() => {
                    setIsLoading(false);
                    navigation('/');
                }, 1500);
            } else {
                setIsLoading(false);
                console.log("Signup failed: ", data.message || response.statusText);
            }
        } catch (error) {
            setIsLoading(false);
            console.log("Error during signup: ", error);
        }
    };

    const onChangeData = (e) => {
        const { name, value } = e.target;
        
        // If email is being changed, clear previous error
        if (name === 'Email') {
            setErrors(prev => ({
                ...prev, 
                Email: ""
            }));
        }

        setFormData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await signup();
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    const loadingVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                duration: 0.5
            }
        },
        exit: { 
            opacity: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <motion.div 
            style={backgroundStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        style={loadingOverlay}
                        variants={loadingVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.h2 
                            style={loadingText}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 300,
                                damping: 10
                            }}
                        >
                            ⏳ Please Wait...
                        </motion.h2>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                className="flex flex-col items-center w-full max-w-lg px-8 py-12 overflow-auto" 
                style={glassStyle}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div 
                    className="text-center mb-8 p-4 rounded-lg w-full" 
                    style={titleStyle}
                    variants={itemVariants}
                >
                    <h1 className="text-3xl text-white">பதிவு செய்யவும்</h1>
                </motion.div>

                <form 
                    className="flex flex-col w-full" 
                    onSubmit={onSubmit}
                >
                    {Object.keys(formData).map((key, index) => (
                        <motion.div 
                            key={key} 
                            className="mb-4"
                            variants={itemVariants}
                        >
                            <motion.input
                                type={key === "Email" ? "email" : key === "Password" ? "password" : "text"}
                                name={key}
                                value={formData[key]}
                                onChange={onChangeData}
                                placeholder={` ${key === "Name" ? "பெயர்" : key === "Email" ? "மின்னஞ்சல்" : "கடவுச்சொல்"}`}
                                className="px-4 py-3 rounded-2xl w-full border border-white text-white placeholder-white bg-transparent"
                                whileFocus={{ 
                                    scale: 1.02,
                                    boxShadow: "0 0 0 3px rgba(255,255,255,0.3)"
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            />
                            <AnimatePresence>
                                {key === "Email" && errors.Email && (
                                    <motion.p 
                                        className="text-red-500 text-sm mt-1"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        {errors.Email}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                    <motion.button 
                        type="submit" 
                        className="bg-black rounded-full py-3 text-white hover:bg-gray-800 transition duration-300 w-full"
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 4px 15px rgba(255,255,255,0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        variants={itemVariants}
                    >
                        பதிவு செய்யவும்
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Signup;

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