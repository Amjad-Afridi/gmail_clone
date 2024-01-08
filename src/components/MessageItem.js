const MessageItem = ({ content }) => {
  return (
    <>
      <br />
      <p className="p-2 border-b-[1px] border-black">{content.snippet}</p>;
      <br />
    </>
  );
};
export default MessageItem;
