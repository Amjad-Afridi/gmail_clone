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

  const iconStyle = "hover:bg-gray-400 font-bold w-fit rounded-full";
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
        messageIds.map(async ({ id }) => {
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
            },
          );
          return response.data;
        }),
      );
      dispatch(setMessagesContent(result));
    };
    searchMessagesResults();
  }, [messageIds]);
  const handleNextList = async () => {
    var query;
    const nextToken = nextPageToken[nextPageToken.length - 1];
    console.log(nextPageToken);
    console.log(location.pathname);
    if (location.pathname === "/unread-messages-list") {
      query = "is:unread";
    } else if (location.pathname === "/sent-messages-list") {
      query = "is:sent";
    } else {
      query = "is:inbox";
    }
    const result = await dispatch(
      MessageList({ profile, token, query, nextToken }),
    );
    console.log("result is : ", result);
  };
  const handlePreviousList = async () => {
    await dispatch(setPreviousToken());
    var query;
    const nextToken = nextPageToken[nextPageToken.length - 3];
    console.log("prev token is: ", nextPageToken);
    console.log(location.pathname);
    if (location.pathname === "/unread-messages-list") {
      query = "is:unread";
    } else if (location.pathname === "/sent-messages-list") {
      query = "is:sent";
    } else {
      query = "is:inbox";
    }
    const result = await dispatch(
      MessageList({ profile, token, query, nextToken }),
    );
    console.log("prev result is : ", result);
  };
  return (
    <>
      <div className="flex justify-between items-center border-b-2 pb-4 mb-8">
        <div className="flex font-extrabold"> All Messages List </div>
        <div className="flex justify-end items-baseline gap-4 ">
          <GrFormPrevious
            size={28}
            className={iconStyle}
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
        {!loading ? (
          messagesContent.length === 0 ? (
            <p> List is Empty</p>
          ) : (
            messagesContent.map((message, index) => (
              <MessageItem key={index} content={message} />
            ))
          )
        ) : (
          <p> Loading Messages</p>
        )}
      </div>
    </>
  );
};
export default MessagesList;
