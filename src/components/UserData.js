import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function UserData() {
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);
    const baseURL = 'https://gmail.googleapis.com'
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
    const logOut = () => {
        googleLogout();
        setProfile([]);
    };

    if(profile.id) {
        const userEmails = async () => {
         const response = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/${profile.id}/messages/18c64ac5e89f6a62`, {
             headers: {
                 Authorization: `Bearer ${user.access_token}`,
                 Accept: 'application/json'
             }
         })
            console.log(response.data)
            // console.log(response.data.messages.map((mes) => mes.id ))
        }
        userEmails()
    }

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data)
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user]
    );


    // useEffect(() => {
    //     console.log('profile after update is : ', user)
    // }, [profile])

    return (
        <div>
            <h2>React Google Login</h2>
            <br />
            {/*{user && console.log(user)}*/}
            <br />
            { profile.length !== 0 ? (
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google</button>
            )}
        </div>
    );
}
export default UserData;