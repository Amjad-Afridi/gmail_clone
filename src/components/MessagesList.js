import MessageItem from "./MessageItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { MessageContent } from "../Redux/Thunks/MessageContent";
const MessagesList = () => {
  const dispatch = useDispatch();
  const { messagesContent, loading, error, profile, token, messageIds } =
    useSelector((state) => state.user);
  useEffect(() => {
    console.log("message IDs are: ", messageIds);
    const searchMessagesResults = () => {
      messageIds.map(({ id }) => {
        return dispatch(MessageContent({ id, profile, token }));
      });
    };
    searchMessagesResults();
  }, []);

  return (
    <>
      <div>this is message list </div>
      {messagesContent && console.log("messages content is: ", messagesContent)}
      {/*  messagesContent.map((item) => <MessageItem content={item} />)}*/}
      {/*{error && <p>{error.message}</p>}*/}
      {/*{loading && <p>loading messages</p>}*/}
    </>
  );
};
export default MessagesList;
