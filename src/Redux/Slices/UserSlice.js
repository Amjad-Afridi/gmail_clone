import {createSlice} from "@reduxjs/toolkit";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {UserProfile} from "../Thunks/UserProfile";

const UserSlice = createSlice({
    name:'user',
    initialState:{
        token: {},
        profile: {},
        loading: false,
        error: null
    },
    reducers: {
            loginInfo: (state, action) => {
                state.token = action.payload
            },
            logoutInfo : (state) => {
            googleLogout();
            state.token = {}
            },
    },
    extraReducers: (builder) => {
        builder.addCase(UserProfile.pending, (state, action) => {
            state.loading = true
        });
            builder.addCase(UserProfile.fulfilled, (state, action) => {
                state.loading = false
                state.profile = action.payload
            });
            builder.addCase(UserProfile.rejected, (state, action) => {
                state.loading =false
                state.error = action.error
            })
    }
})
export const { error, loading, token, profile, loginInfo, logoutInfo} = UserSlice.actions
export const
    UserSliceReducer
 = UserSlice.reducer