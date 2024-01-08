import { createSlice } from "@reduxjs/toolkit";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { UserProfile } from "../Thunks/UserProfile";
import { MessageList } from "../Thunks/MessageList";
import { MessageContent } from "../Thunks/MessageContent";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    token: {},
    profile: {},
    messageIds: [],
    messagesContent: [],
    loading: false,
    error: null,
  },
  reducers: {
    loginInfo: (state, action) => {
      state.token = action.payload;
    },
    logoutInfo: (state) => {
      googleLogout();
      state.token = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(UserProfile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(UserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(UserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
    builder.addCase(MessageList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(MessageList.fulfilled, (state, action) => {
      state.loading = false;
      state.messageIds = action.payload.messages;
    });
    builder.addCase(MessageList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });

    builder.addCase(MessageContent.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(MessageContent.fulfilled, (state, action) => {
      state.loading = false;
      // console.log("text content", action.payload.payload.parts[0]);
      // state.messagesContent.plainContent = action.payload.payload.parts[0];
      // console.log("html content", action.payload.payload.parts[1]);
      // state.messagesContent.htmlContent = action.payload.payload.parts[1];
      state.messagesContent.push(action.payload);
      // state.messagesContent = action.payload;
      // action.payload.payload.parts.forEach((part) => {
      //   if (part.mimeType === "text/html" || part.mimeType === "text/plain") {
      //     const bodyContent = part.body.data;
      //     const safeContent = bodyContent.replace(/-/g, "+").replace(/_/g, "/");
      //     state.messagesContent.push(atob(safeContent));
      //   }
      // });
    });
    builder.addCase(MessageContent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});
export const { error, loading, token, profile, loginInfo, logoutInfo } =
  UserSlice.actions;
export const UserSliceReducer = UserSlice.reducer;
