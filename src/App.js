import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {GoogleLogin, googleLogout, useGoogleLogin} from '@react-oauth/google';
import {loginInfo, logoutInfo} from "./Redux/Slices/UserSlice";
import {UserProfile} from "./Redux/Thunks/UserProfile";

function App() {
    const dispatch = useDispatch()
    const [userToken, setUserToken] = useState({})
    const { token, error, loading, profile} = useSelector((state) => state.user)

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUserToken(codeResponse)
        },
        onError: (error) => console.log('Login Failed:', error)
    })
    const handleLogout = () => {
        setUserToken({})
        dispatch(logoutInfo())
    }
    const getProfile = async () => {
       const result = await dispatch(UserProfile(token))
    }
    if(userToken.access_token){
        dispatch(loginInfo(userToken.access_token))
    }

    return(
        <>
            <div> login with google</div>
            {userToken.access_token ? <div>
                <button onClick={handleLogout}>logout</button>
                <button onClick={getProfile}>Get Profile</button>
                {error && <p>{error.message}</p>}
                {loading && <p>loading</p>}
            </div> : <button onClick={() => login()}>login</button>  }
        </>
    )
}
export default App;