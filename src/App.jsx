import React, { useState, useEffect } from "react";
import Home from "./Component/Home";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Video from "./Component/Video";
import Signup from "./Auth/Signup";
import SignIn from "./Auth/SignIn";
import isAuthenticated from "./isAuth/isAuth";
import Morning from "./Component/Morning";

const ProtectedRoute = ({ children, authStatus }) => {
    return authStatus ? children : <Navigate to="/login" replace />;
};

export default function App() {
    const [authStatus, setAuthStatus] = useState(() => {
        return localStorage.getItem("authStatus") === "true";
    });

    // Update authentication status on app load
    useEffect(() => {
        setAuthStatus(isAuthenticated());
        localStorage.setItem("authStatus", isAuthenticated());
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("authStatus");
        setAuthStatus(false);
    };

    return (
        <>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/signup" element={<Signup setAuthStatus={setAuthStatus} />} />
                    <Route path="/login" element={<SignIn setAuthStatus={setAuthStatus} />} />

                    {/* Private routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute authStatus={authStatus}>
                                <Home setAuthStatus={setAuthStatus} onLogout={handleLogout} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/video"
                        element={
                            <ProtectedRoute authStatus={authStatus}>
                                <Video />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/morning"
                        element={
                            <ProtectedRoute authStatus={authStatus}>
                                <Morning />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </>
    );
}