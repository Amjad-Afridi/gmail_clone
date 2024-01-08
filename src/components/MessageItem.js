const MessageItem = ({ htmlContent, plainContent }) => {
  return (
    <>
      {htmlContent && <div dangerouslySetInnerHTML={{ __html: htmlContent }} />}
      {plainContent && <pre>{plainContent}</pre>}
    </>
  );
};
export default MessageItem;
