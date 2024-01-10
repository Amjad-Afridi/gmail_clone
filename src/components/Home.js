import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutInfo } from "../Redux/Slices/UserSlice";
import { UserProfile } from "../Redux/Thunks/UserProfile";
import { useEffect } from "react";
import { MessageList } from "../Redux/Thunks/MessageList";
import MessagesList from "./MessagesList";
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, error, loading, profile, messageIds, messagesContent } =
    useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutInfo());
    navigate("/login");
  };

  useEffect(() => {
    const searchMessages = () => {
      dispatch(MessageList({ profile, token }));
    };
    searchMessages();
  }, [profile]);

  return (
    <>
      <Header />
      <div className="flex gap-2">
        <Sidebar className=" w-[20%]" />
        <MessagesList className=" w-[80%]" />
      </div>
      <Outlet />
    </>
  );
};
export default Home;
