import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {GoogleOAuthProvider} from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider  clientId='749751951330-iuvfo2nvavv504ugpetht76upao9n6dh.apps.googleusercontent.com' >
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>
);


