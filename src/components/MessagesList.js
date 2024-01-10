import { MessageList } from "../Redux/Thunks/MessageList";
import MessageItem from "./MessageItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { MessageContent } from "../Redux/Thunks/MessageContent";
const MessagesList = () => {
  const dispatch = useDispatch();
  const { messagesContent, loading, error, profile, token, messageIds } =
    useSelector((state) => state.user);
  useEffect(() => {
    const searchMessagesResults = () => {
      console.log("profile value:", profile);
      console.log("token value:", token);
      console.log(" messages IDs :", messageIds);
      const result = messageIds.map(({ id }) => {
        return dispatch(MessageContent({ id, profile, token }));
      });
    };
    searchMessagesResults();
  }, [messageIds, profile]);

  return (
    <>
      <div className="w-[70%]">
        {messagesContent.length &&
          messagesContent.map((message) => <MessageItem content={message} />)}
        {error && <p>{error.message}</p>}
        {loading && <p>loading messages</p>}
      </div>
    </>
  );
};
export default MessagesList;
