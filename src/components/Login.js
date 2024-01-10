import { useGoogleLogin } from "@react-oauth/google";
import { loginInfo } from "../Redux/Slices/UserSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      dispatch(loginInfo(codeResponse.access_token));
      navigate("/");
    },
    onError: (error) => console.log("Login Failed:", error),
    scope: "https://www.googleapis.com/auth/gmail.readonly",
  });

  return (
    <div className="flex flex-col gap-4 m-auto">
      <div className="font-medium"> Login with google</div>
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
