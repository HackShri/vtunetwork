import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

function PublicOnlyRoute() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useSelector(state => state.Authproject || {});

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <div className="text-xl animate-pulse">Verifying Session...</div>
            </div>
        );
    }

    return <Outlet />;
}

export default PublicOnlyRoute;
