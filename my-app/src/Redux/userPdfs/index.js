import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchUserPdfs = createAsyncThunk('fetchuserPdfs', async () => {
    try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
        let response = await fetch(`${API_BASE}/api/user/fetchPdfs`)
        let data = await response.json()
        console.log(data)

        return data
    } catch (error) {
        console.log(error.message)
    }
})

const initialState = {
    pdfs: null,
    isLoading: false
}
const userPdfs = createSlice({
    name: 'userPdfs',
    initialState,
    reducers: {},
    extraReducers: (builders) => {
        builders.addCase(fetchUserPdfs.pending, (state, action) => {
            state.isLoading = true
        }).addCase(fetchUserPdfs.fulfilled, (state, action) => {
            state.pdfs = action.payload.data
            state.isLoading = false
        }).addCase(fetchUserPdfs.rejected, (state, action) => {
            state.isLoading = false
        })
    }
})

export default userPdfs.reducer;