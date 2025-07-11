import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const checkAuthStatus = createAsyncThunk("user/checkAuthStatus", async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, { withCredentials: true })
    return (res.data)
})

const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoading: true,
        user: null
    },
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload
            state.isLoading = false
        },
        removeUser: (state, action) => {
            state.user = null
            state.isLoading = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
            state.user = action.payload
            state.isLoading = false

        }).addCase(checkAuthStatus.rejected, (state, action) => {
            state.user = null
            state.isLoading = false
        })
    }
})

export const { addUser, removeUser } = userSlice.actions

export default userSlice.reducer