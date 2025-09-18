import { Button } from "@/components/ui/button";
import { registerForm } from "@/Redux/AuthStore";
import React, { useState } from "react";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Register() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [register, setRegister] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        setRegister((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        dispatch(registerForm(register)).then((result) => {
            if (result.payload.success) {
                localStorage.setItem('isLoggedIn', true)
                navigate('/')
            }
        }).catch((err) => {
            console.log(err)

        });



        // You can POST this data to your backend register route
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 font-sans">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

                <div className="flex justify-center space-x-4 mb-4">
                    <Button className='w-full'> <FaGoogle size={24} className="text-white" /> Sign  up with Google
                    </Button>
                </div>

                <span className="block text-center text-sm text-gray-500 mb-4">
                    or use your email for registration
                </span>
                <h5 className="block text-center text-sm text-black mb-4">
                    if you account ?<a href="/login" > Login Please</a>                </h5>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        value={register.username}
                        onChange={handleInputChange}
                        placeholder="Username"
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={register.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={register.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-black       text-white py-2 rounded-full font-semibold hover:bg-pink-700 transition"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
