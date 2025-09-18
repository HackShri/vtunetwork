    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
import { Button } from '@/components/ui/button';
import { loginForm } from '@/Redux/AuthStore';
import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [login, setLogin] = useState({
        type: 'simpleLogin',
        email: '',
        password: '',
    });

    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE}/api/user/auth/google`;
    };

    const handleInputChange = (e) => {
        setLogin((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginForm(login)).then((result) => {
            console.log(result.payload)
            if (result.payload.success) {
                window.location.reload()
                navigate('/')
            }
        }).catch((err) => {

        });


        // You can send login.email and login.password to your backend here
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 font-sans">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

                <div className="flex justify-center mb-4">
                    <Button onClick={handleGoogleLogin}

                        className="cursor-pointer text-white w-full hover:scale-110 transition-transform"
                    > <FaGoogle size={30}></FaGoogle> Sign in with Google </Button >
                </div>

                <span className="block text-center text-sm text-gray-500 mb-4">
                    or use your email and password
                </span>
                <p className='text-center mb-2'>Don't Have Account ? <a href={'/register'}>Register Here</a></p>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        value={login.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={login.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
                        required
                    />
                    <div className="text-right">
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-pink-600 text-white py-2 rounded-full font-semibold hover:bg-pink-700 transition"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
