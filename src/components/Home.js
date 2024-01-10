import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutInfo } from "../Redux/Slices/UserSlice";
import { UserProfile } from "../Redux/Thunks/UserProfile";
import { MessageList } from "../Redux/Thunks/MessageList";
import { MessageContent } from "../Redux/Thunks/MessageContent";
import { useEffect } from "react";
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, error, loading, profile, messageIds, messagesContent } =
    useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutInfo());
    navigate("/login");
  };
  // const searchMessagesResults = () => {
  //   messageIds.map(({ id }) => {
  //     return dispatch(MessageContent({ id, profile, token }));
  //   });
  // };
  // const loadMessages = () => {
  //   messagesContent.map((item) => {
  //     console.log("item is :", item);
  //   });
  // };
  useEffect(() => {
    const getProfile = async () => {
      const result = await dispatch(UserProfile(token));
      console.log("search profile api result ", result);
    };
    getProfile();
    const searchMessages = async () => {
      const result = await dispatch(MessageList({ profile, token }));
      console.log("search messages api result ", result);
    };
    searchMessages();
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
      <Outlet />
    </>
  );
};
export default Home;
