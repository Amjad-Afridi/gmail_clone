import { createSlice } from "@reduxjs/toolkit";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { UserProfile } from "../Thunks/UserProfile";
import { MessageList } from "../Thunks/MessageList";
import { MessageContent } from "../Thunks/MessageContent";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    profile: null,
    messageIds: [],
    messagesContent: [],
    nextPageToken: [],
    loading: false,
    error: null,
  },
  reducers: {
    loginInfo: (state, action) => {
      state.token = action.payload;
    },
    logoutInfo: (state) => {
      googleLogout();
      state.token = null;
    },
    setMessagesContent: (state, action) => {
      state.messagesContent = action.payload;
    },
    setPreviousToken: (state, action) => {
      console.log("Previous token dispatched: ", state.nextPageToken);
      if (state.nextPageToken.length > 1) {
        state.nextPageToken.splice(-2, 2);
      }
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
      state.nextPageToken.push(action.payload.nextPageToken);
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
      state.messagesContent.push(action.payload);
    });
    builder.addCase(MessageContent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});
export const {
  error,
  setMessagesContent,
  loading,
  token,
  profile,
  messageIds,
  messagesContent,
  setPreviousToken,
  loginInfo,
  logoutInfo,
} = UserSlice.actions;
export const UserSliceReducer = UserSlice.reducer;
