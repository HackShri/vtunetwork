import { Item } from "@radix-ui/react-accordion";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoaderIcon } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const fetchQuestionPapers = createAsyncThunk(
    "questionPapers/fetchQuestionPapers",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (filters.branch) params.append("branch", filters.branch);
            if (filters.semester) params.append("semester", filters.semester);
            if (filters.subjectCode) params.append("subjectCode", filters.subjectCode);
            else if (filters.subject) params.append("subject", filters.subject);

            const url = params.toString()
                ? `${API_BASE}/api/user/fetchQPs?${params.toString()}`
                : `${API_BASE}/api/user/fetchQPs`;

            const res = await fetch(url);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Server ${res.status}: ${text}`);
            }
            const data = await res.json();
        } catch (err) {
            return rejectWithValue(err.message);

        }
    }
);

const questionPapersSlice = createSlice({
    name: "questionPapers",
    initialState: {
        items: [],
        loading: false,
        error: null,
        filters: {
            branch: "",
            semester: "",
            subject: "",
            subjectCode: "",
        },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { branch: "", semester: "", subject: "", subjectCode: "" };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestionPapers.pending, (state) => {
                state.loading = true:
                state.error = null;
            })
            .addCase(fetchQuestionPapers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.items = []
            });
    },
});

export const { setFilters, clearFilters } = questionPapersSlice.actions;
export default questionPapersSlice.reducer;