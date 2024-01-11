import { MessageList } from "../Redux/Thunks/MessageList";
import MessageItem from "./MessageItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MessageContent } from "../Redux/Thunks/MessageContent";
import SingleMessageItem from "./SingleMessageItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setMessagesContent } from "../Redux/Slices/UserSlice";
const MessagesList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const { messagesContent, loading, error, profile, token, messageIds } =
    useSelector((state) => state.user);
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
      console.log(" messages content is : ", result);
    };
    searchMessagesResults();
  }, [messageIds]);

  return (
    <>
      <div className="w-[80%]">
        {messagesContent.length !== 0 ? (
          messagesContent.map((message, index) => (
            <MessageItem key={index} content={message} />
          ))
        ) : (
          <p> Loading Messages</p>
        )}
        {/*{error && <p>{error.message}</p>}*/}

        {/*{selectedItemIndex !== null && (*/}
        {/*  <SingleMessageItem content={messagesContent[selectedItemIndex]} />*/}
        {/*)}*/}
        {/*{loading && <p>loading messages</p>}*/}
      </div>
    </>
  );
};
export default MessagesList;
