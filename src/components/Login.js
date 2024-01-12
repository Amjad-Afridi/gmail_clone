import { useGoogleLogin } from "@react-oauth/google";
import { loginInfo } from "../Redux/Slices/UserSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../Redux/Thunks/UserProfile";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      dispatch(loginInfo(codeResponse.access_token));
      dispatch(UserProfile(codeResponse.access_token));
      navigate("/");
    },
    onError: (error) => console.log("Login Failed:", error),
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    scope: "https://www.googleapis.com/auth/gmail.send",
    scope: "https://www.googleapis.com/auth/gmail.compose",
  });

  return (
    <div className="flex flex-col w-fit gap-4 mx-auto justify-center items-center mt-56 border-gray-300 border-2 p-8 rounded-lg">
      <div className="font-medium"> Login to your Gmail</div>
      <button
        className="p-4 bg-blue-900 rounded-lg text-white font-medium w-fit"
        onClick={() => login()}
      >
        Login with google
      </button>
    </div>
  );
};
export default Login;
