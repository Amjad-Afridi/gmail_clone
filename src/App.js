import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutInfo } from "./Redux/Slices/UserSlice";
import { UserProfile } from "./Redux/Thunks/UserProfile";
import MessagesList from "./components/MessagesList";
import axios from "axios";
import MessageItem from "./components/MessageItem";
import { MessageContent } from "./Redux/Thunks/MessageContent";
import Login from "./components/Login";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import NewMessage from "./components/NewMessage";
import SingleMessageItem from "./components/SingleMessageItem";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="messages-list" element={<MessagesList />} />
          <Route path="message" element={<NewMessage />} />
          <Route path="message-item" element={<SingleMessageItem />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      <br />
      {}
    </>
  );
}
export default App;
