import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Checkauth() {
    const navigate = useNavigate()
    const location = useLocation()
    console.log(location.pathname)
    const { isAuthenticated } = useSelector(state => state?.Authproject)
    console.log(isAuthenticated)

    useEffect(() => {
        if (isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
            navigate('/')
        }
        if (!localStorage.getItem('login') && (!location.pathname.includes('/login') || location.pathname.includes("/register"))) (
            navigate('/login')
        )

    }, [isAuthenticated])




    return <Outlet />;
}

export default Checkauth;
