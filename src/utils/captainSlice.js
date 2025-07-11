import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const checkCaptainStatus = createAsyncThunk("captain/checkCaptainStatus", async () => {
    try {
        console.log("Started api call")
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/profile`, { withCredentials: true })
        return (res.data)
    } catch (error) {
        console.log(error)
    }
})

const captainSlice = createSlice({
    name: "captain",
    initialState: {
        isLoading: true,
        captain: null
    },
    reducers: {
        addCaptain: (state, action) => {
            state.captain = action.payload
            state.isLoading = false
        },
        removeCaptain: (state, action) => {
            state.captain = null
            state.isLoading = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(checkCaptainStatus.fulfilled, (state, action) => {
            state.captain = action.payload
            state.isLoading = false
        }).addCase(checkCaptainStatus.rejected, (state, action) => {
            state.captain = null
            state.isLoading = false
        })
    }
})

export const { addCaptain, removeCaptain } = captainSlice.actions

export default captainSlice.reducer