import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Document, Page } from "react-pdf";

const MessageItem = ({ content }) => {
  const { profile, token } = useSelector((state) => state.user);
  const [htmlContent, setHtmlContent] = useState(null);
  const [plainContent, setPlainContent] = useState(null);
  const [attachmentId, setAttachmentId] = useState([]);
  const [files, setFiles] = useState(null);
  const expandComponent = () => {
    if (content.payload.mimeType === "multipart/mixed") {
      console.log("mixed data: ", content.payload.parts);
      setPlainContent(content.payload.parts[0].parts[0]);
      setHtmlContent(content.payload.parts[0].parts[1]);
      setAttachmentId(content.payload.parts[1].body.attachmentId);
    }
    // if(content.payload.mimeType === "multipart/alternative")
    else {
      console.log("alternative", content.payload.parts);
      setPlainContent(content.payload.parts[0]);
      setHtmlContent(content.payload.parts[1]);
    }
  };
  const getAttachment = () => {
    axios
      .get(
        `https://gmail.googleapis.com/gmail/v1/users/${profile.email}/messages/${content.id}/attachments/${attachmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          params: {
            format: "full",
          },
        }
      )
      .then(
        (response) => setFiles(response.data.data)
        // replace(/-/g, "+").replace(/_/g, "/")
      );
  };
  return (
    <>
      <br />
      <div
        className=" flex p-2 border-b-[1px] border-black"
        onClick={expandComponent}
      >
        {content.snippet !== ""
          ? content.snippet
          : content.payload.headers.filter((item) => item.name === "From")[0]
              .value}
      </div>
      {/* {attachmentId.length && (
        <button onClick={getAttachment}>getAttachment</button>
      )} */}
      {/* {files && (
        <Document file={files}>
          {" "}
          <Page />{" "}
        </Document>
      )} */}
      {plainContent && (
        <pre>
          {atob(plainContent.body.data.replace(/-/g, "+").replace(/_/g, "/"))}
        </pre>
      )}
      {htmlContent && (
        <div
          dangerouslySetInnerHTML={{
            __html: atob(
              htmlContent.body.data.replace(/-/g, "+").replace(/_/g, "/")
            ),
          }}
        />
      )}
    </>
  );
};
export default MessageItem;
