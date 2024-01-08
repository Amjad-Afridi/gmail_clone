import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { loginInfo, logoutInfo } from "./Redux/Slices/UserSlice";
import { UserProfile } from "./Redux/Thunks/UserProfile";
import { MessageList } from "./Redux/Thunks/MessageList";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MessageItem from "./components/MessageItem";
import { MessageContent } from "./Redux/Thunks/MessageContent";

function App() {
  const [htmlContent, setHtmlContent] = useState([]);
  const [plainContent, setPlainContent] = useState([]);
  const dispatch = useDispatch();
  const [userToken, setUserToken] = useState({});
  const { token, error, loading, profile, messageIds, messagesContent } =
    useSelector((state) => state.user);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUserToken(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
    scope: "https://www.googleapis.com/auth/gmail.readonly",
  });
  const handleLogout = () => {
    setUserToken({});
    dispatch(logoutInfo());
  };
  const getProfile = async () => {
    const result = await dispatch(UserProfile(token));
  };
  const searchMessages = async () => {
    dispatch(MessageList({ profile, token }));
  };
  if (userToken.access_token) {
    dispatch(loginInfo(userToken.access_token));
  }
  const searchMessagesResults = () => {
    messageIds.map(({ id }) => {
      return dispatch(MessageContent({ id, profile, token }));
    });
  };
  const loadMessages = () => {
    messagesContent.map((item) => {
      console.log(item);
    });
  };
  return (
    <>
      <Header />
      <Sidebar />
      <br /> <br />
      <div> login with google</div>
      {userToken.access_token ? (
        <div>
          <button onClick={handleLogout}>logout</button>
          <br />
          <button onClick={getProfile}>Get Profile</button>
          <br />
          <button onClick={searchMessages}>Search Message IDs</button> <br />
          <button onClick={searchMessagesResults}>
            Search Message results
          </button>
          <br />
          <button onClick={loadMessages}>load messages</button>
          <br />
          {messagesContent.length && console.log(messagesContent)}
          {/*  messagesContent.map((item) => {*/}
          {/*    return <div dangerouslySetInnerHTML={{ __html: item }} />;*/}
          {/*  })}*/}
          {error && <p>{error.message}</p>}
          {loading && <p>loading</p>}
        </div>
      ) : (
        <button onClick={() => login()}>login</button>
      )}
    </>
  );
}
export default App;
