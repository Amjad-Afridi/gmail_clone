import { createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import axios from "axios";

export const MessageList = createAsyncThunk(
  "user/messages",
  async ({ profile, token }) => {
    const response = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/${profile.email}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: {
          maxResults: 10,
        },
      }
    );
    return response.data;
  }
);
