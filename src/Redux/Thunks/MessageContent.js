import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const MessageContent = createAsyncThunk(
  "user/messageContent",
  async ({ id, profile, token }) => {
    const response = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/${profile.email}/messages/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: {
          format: "full",
        },
      },
    );
    console.log("response data: ", response.data);
    return response.data;
  },
);
