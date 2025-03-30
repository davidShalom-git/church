const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Returns `true` if the token exists
};

export default isAuthenticated;