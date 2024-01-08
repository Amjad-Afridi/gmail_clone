import ReactDOMServer from "react-dom/server";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { loginInfo, logoutInfo } from "./Redux/Slices/UserSlice";
import { UserProfile } from "./Redux/Thunks/UserProfile";
import axios from "axios";
import Sidebar from "./components/Sidebar";

function App() {
  const dispatch = useDispatch();
  const [htmlContent, setHtmlContent] = useState([]);
  const [userToken, setUserToken] = useState({});
  const { token, error, loading, profile } = useSelector((state) => state.user);

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
    if (profile) {
      //   console.log(profile);
      //   console.log("token is: ", token);
      try {
        const result = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/${profile.email}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            params: {
              maxResults: 15,
            },
          }
        );
        const messages = result.data.messages.map(async ({ id }) => {
          await axios
            .get(
              `https://gmail.googleapis.com/gmail/v1/users/${profile.email}/messages/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
                params: {
                  format: "full",
                },
              }
            )
            .then((response) => {
              response.data.payload.parts.forEach((part) => {
                if (
                  part.mimeType === "text/plain" ||
                  part.mimeType === "text/html"
                ) {
                  const content = part.body.data;
                  const safeContent = content
                    .replace(/-/g, "+")
                    .replace(/_/g, "/");
                  const decodedContent = atob(safeContent);
                  setHtmlContent([...htmlContent, decodedContent]);
                }
              });
            })
            .catch((e) => e.message);
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  };
  if (userToken.access_token) {
    dispatch(loginInfo(userToken.access_token));
  }

  return (
    <>
      <div> login with google</div>
      {userToken.access_token ? (
        <div>
          <button onClick={handleLogout}>logout</button>
          <button onClick={getProfile}>Get Profile</button>
          <button onClick={searchMessages}>Search Messages</button>
          {error && <p>{error.message}</p>}
          {loading && <p>loading</p>}
        </div>
      ) : (
        <button onClick={() => login()}>login</button>
      )}
      {htmlContent.length > 0 &&
        htmlContent.map((itemHtml) => {
          return <div dangerouslySetInnerHTML={{ __html: itemHtml }} />;
        })}
    </>
  );
}
export default App;
