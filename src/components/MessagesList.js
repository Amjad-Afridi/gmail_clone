import { MessageList } from "../Redux/Thunks/MessageList";
import MessageItem from "./MessageItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MessageContent } from "../Redux/Thunks/MessageContent";
import SingleMessageItem from "./SingleMessageItem";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  setMessagesContent,
  setPreviousToken,
} from "../Redux/Slices/UserSlice";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
const MessagesList = () => {
  const location = useLocation();
  const iconStyle =
    "hover:bg-gray-400 font-bold w-fit rounded-full hover:cursor-pointer";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const {
    messagesContent,
    loading,
    nextPageToken,
    error,
    profile,
    token,
    messageIds,
  } = useSelector((state) => state.user);
  useEffect(() => {
    const searchMessagesResults = async () => {
      const result = await Promise.all(
        messageIds.map(async ({ id, threadId }) => {
          // return dispatch(MessageContent({ id, profile, token }));
          const response = await axios.get(
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
          );
          return response.data;
        })
      );
      // console.log("messages are: ", result);
      dispatch(setMessagesContent(result));
    };
    const searchThreadsResults = async () => {
      const result = await Promise.all(
        messageIds.map(async ({ threadId }) => {
          // return dispatch(MessageContent({ id, profile, token }));
          const response = await axios.get(
            `https://gmail.googleapis.com/gmail/v1/users/${profile.email}/threads/${threadId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
              params: {
                format: "full",
              },
            }
          );
          return response.data;
        })
      );
      // console.log(" threads are : ", result);
    };
    Promise.all([searchMessagesResults(), searchThreadsResults()]);
  }, [messageIds]);
  const handleNextList = async () => {
    var query;
    const nextToken = nextPageToken[nextPageToken.length - 1];
    if (location.pathname === "/unread-messages-list") {
      query = "is:unread";
    } else if (location.pathname === "/sent-messages-list") {
      query = "is:sent";
    } else {
      query = "is:inbox";
    }
    dispatch(MessageList({ profile, token, query, nextToken }));
  };
  const handlePreviousList = async () => {
    var query;
    if (nextPageToken.length === 0 || nextPageToken.length === 1) return;
    dispatch(setPreviousToken());
    if (location.pathname === "/unread-messages-list") {
      query = "is:unread";
    } else if (location.pathname === "/sent-messages-list") {
      query = "is:sent";
    } else {
      query = "is:inbox";
    }

    if (nextPageToken.length == 2) {
      dispatch(MessageList({ profile, token, query }));
    } else {
      const nextToken = nextPageToken[nextPageToken.length - 3];
      dispatch(MessageList({ profile, token, query, nextToken }));
    }
  };
  return (
    <>
      <div className="flex justify-between items-center border-b-2 pb-4 mb-8">
        <div className="flex font-extrabold"> All Messages List </div>
        <div className="flex justify-end items-baseline gap-4 ">
          <GrFormPrevious
            size={28}
            className={`${iconStyle} + ${
              nextPageToken.length === 1 &&
              " cursor-not-allowed hover:bg-inherit"
            }`}
            onClick={handlePreviousList}
          />
          <MdNavigateNext
            size={32}
            className={iconStyle}
            onClick={handleNextList}
          />
        </div>
      </div>

      <div className="w-full">
        {loading ? (
          <p className="bg-gray-300 p-4 rounded-lg w-fit shadow-md">
            {" "}
            Loading Messages....!
          </p>
        ) : messagesContent.length === 0 ? (
          <p> No messages available</p>
        ) : (
          messagesContent.map((message, index) => (
            <MessageItem key={index} content={message} />
          ))
        )}
      </div>
    </>
  );
};
export default MessagesList;
