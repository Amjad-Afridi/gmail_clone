import { createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import axios from "axios";

export const MessageList = createAsyncThunk(
  "user/messages",
  async ({ profile, token, query, nextToken = null }) => {
    const response = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/${profile.email}/messages?q=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: {
          maxResults: 10,
          pageToken: nextToken,
        },
      },
    );
    return response.data;
  },
);
