import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Fetch Question Papers (type = "questionpaper")
 * Reuses the same filtering approach as fetchUserPdfs
 */
export const fetchQPs = createAsyncThunk("questionPapers/fetch", async (filters = {}) => {
    try {
        const params = new URLSearchParams();

        // Apply user-selected filters (branch, semester, subject, etc.)
        if (filters.branch) params.append("branch", filters.branch);
        if (filters.semester) params.append("semester", filters.semester);
        if (filters.subject) params.append("subjectName", filters.subject);
        if (filters.subjectCode) params.append("subjectCode", filters.subjectCode);

        // ✅ Core difference: force type = "questionpaper"
        params.append("type", "questionpaper");

        const url = `${API_BASE}/api/user/fetchPdfs?${params.toString()}`;
        console.log("Fetching Question Papers from:", url);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        console.log("Fetched Question Papers:", data);

        return data;
    } catch (error) {
        console.error("Error fetching QPs:", error);
        throw error;
    }
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
            type: "questionpaper",
        },
    },
    reducers: {
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters(state) {
            state.filters = {
                branch: "",
                semester: "",
                subject: "",
                subjectCode: "",
                type: "questionpaper",
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQPs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchQPs.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns { data: [...] }
                state.papers = action.payload.data || action.payload;
            })
            .addCase(fetchQPs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setFilters, clearFilters } = questionPapersSlice.actions;
export default questionPapersSlice.reducer;
