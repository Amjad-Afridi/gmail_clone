import {createAsyncThunk} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import axios from "axios";

export const UserProfile = createAsyncThunk('user/profile', async (token) => {
    const response = await axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        })
    return response.data
} )
