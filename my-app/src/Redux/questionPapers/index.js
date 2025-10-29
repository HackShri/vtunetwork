import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const fetchQPs = createAsyncThunk("questionPapers/fetch", async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.branch) params.append("branch", filters.branch);
    if (filters.semester) params.append("semester", filters.semester);
    if (filters.subject) params.append("subjectName", filters.subject);
    if (filters.subjectCode) params.append("subjectCode", filters.subjectCode);

    // Use the new papers/filter endpoint
    const res = await fetch(`${API_BASE}/api/user/papers/filter?${params}`);
    const data = await res.json();
    return data;
});

const questionPapersSlice = createSlice({
    name: "questionPapers",
    initialState: {
        papers: [],
        loading: false,
        error: null,
        filters: {
            branch: "",
            semester: "",
            subject: "",
            subjectCode: "",
            type: "questionpaper"
        },
    },
    reducers: {
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters(state) {
            state.filters = { branch: "", semester: "", subject: "", subjectCode: "" };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQPs.pending, (state) => { state.loading = true; })
            .addCase(fetchQPs.fulfilled, (state, action) => {
                state.loading = false;
                state.papers = action.payload;
            })
            .addCase(fetchQPs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setFilters, clearFilters } = questionPapersSlice.actions;
export default questionPapersSlice.reducer;
