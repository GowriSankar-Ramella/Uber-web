import { configureStore } from "@reduxjs/toolkit"
import UserReducer from "./userSlice"
import CaptainReducer from "./captainSlice"

const store = configureStore({
    reducer: {
        user: UserReducer,
        captain: CaptainReducer
    }
})

export default store

