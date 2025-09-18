const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const initialState = {
    user: null,
    isLoading: false,
    isAuthenticated: null,
    userName: null
}

export const loginForm = createAsyncThunk('AuthLogin', async (formdata) => {

    try {
        console.log(formdata)
        let response = await fetch(`${API_BASE}/api/user/login`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(formdata)
        })
        let data = await response.json()
        console.log(data)
        return data


    } catch (error) {
        console.log(error)
    }
})

export const registerForm = createAsyncThunk('Authregister', async (formdata) => {

    try {
        console.log(formdata)
        let response = await fetch(`${API_BASE}/api/user/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(formdata)
        })
        let data = await response.json()
        console.log(data)
        return data

    } catch (error) {
        console.log(error)
    }
})

export const AuthMiddleWare = createAsyncThunk('Authmiddleware', async () => {
    try {
        let response = await fetch(`${API_BASE}/api/user/authMiddle`, {
            credentials: 'include',
        })
        if (!response.ok) {
            const text = await response.text()
            throw new Error(text || 'Auth check failed')
        }
        let data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        return { success: false, isAuthenticated: false, message: error.message }
    }
})
const AuthSlices = createSlice({
    name: 'AuthSlice',
    initialState,
    extraReducers: (builders) => {
        builders.addCase(loginForm.pending, (state, action) => {
            state.isLoading = true
        }).addCase(loginForm.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.isLoading = false
                state.accessToken = action.payload.accessToken
                state.user = action.payload.user
            }
        }).addCase(loginForm.rejected, (state, action) => {
            state.isLoading = false
        }).addCase(AuthMiddleWare.pending, (state, action) => {
            state.isLoading = true
        }).addCase(AuthMiddleWare.fulfilled, (state, action) => {
            if (action.payload && action.payload.success) {
                console.log(action.payload)
                state.isLoading = false
                state.isAuthenticated = action.payload.isAuthenticated
                console.log(state.isAuthenticated)
                localStorage.setItem('login', state.isAuthenticated)
                state.user = action.payload.user
                state.userName = action.payload.userName
            }
        }).addCase(AuthMiddleWare.rejected, (state, action) => {
            state.isAuthenticated = false
            state.isLoading = false
        })

    }
})

export default AuthSlices.reducer
// hello world bro