import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const SingleMessageItem = () => {
  const navigate = useNavigate();
  const [emailText, setEmailText] = useState("");
  const { profile, token } = useSelector((state) => state.user);
  const [replyMessageBox, setReplyMessageBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [forwardMessageBox, setForwardMessageBox] = useState(false);
  const [htmlContent, setHtmlContent] = useState(null);
  const [attachmentId, setAttachmentId] = useState([]);
  const [files, setFiles] = useState(null);
  const location = useLocation();
  const content = location.state.content;
  const [attachmentResponses, setAttachmentResponses] = useState([]);
  const [attachments, setAttachments] = useState(null);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const btnStyle =
    "w-fit text-black hover:bg-gray-300 px-6 py-1 rounded-md border-[2px]";
  useEffect(() => {
    const expandComponent = () => {
      console.log("item content is : ", content.payload);
      if (content.payload.body.size > 0) {
        setHtmlContent(content.payload);
      } else if (content.payload.mimeType === "multipart/mixed") {
        console.log("mixed data content is: ", content.payload.parts);
        setAttachments(
          content.payload.parts &&
            content.payload.parts.filter(
              (part) => part.filename && part.body.attachmentId
            )
        );
        console.log("attachments are: ", attachments);
        if (content.payload.parts.parts) {
          console.log(
            " when parts parts is true ",
            content.payload.parts.parts[0]
          );
          setHtmlContent(
            content.payload.parts.parts[0].find(
              (part) => part.mimeType === "text/html"
            )
          );
        } else {
          if (content.payload.parts[0].body.size > 0) {
            setHtmlContent(content.payload.parts[0]);
          } else {
            setHtmlContent(
              content.payload.parts[0].parts.find(
                (part) => part.mimeType === "text/html"
              )
            );
          }
        }
      }
      // if(content.payload.mimeType === "multipart/alternative")
      else {
        console.log("mimetype is : ", content.payload.mimeType);
        console.log("content is: ", content);
        content.payload.parts &&
          setHtmlContent(
            content.payload.parts.find((part) => part.mimeType === "text/html")
          );
      }
    };
    expandComponent();
  }, [content]);
  useEffect(() => {
    const fetchAttachments = async (attachments) => {
      try {
        attachments.length > 0 && setAttachmentsLoading(true);
        const responses = await Promise.all(
          attachments.map(async (attachment) => {
            const response = await axios.get(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${profile.email}/attachments/${attachment.body.attachmentId}`,
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
            return response;
          })
        );
        setAttachmentsLoading(false);
        console.log("attachment responses are: ", responses);
        setAttachmentResponses(responses);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAttachments(attachments);
  }, [attachments]);
  const handleForward = () => {
    setForwardMessageBox(true);
  };
  const handleReply = () => {
    setReplyMessageBox(true);
  };
  const handleChange = (e) => {
    setEmailText(e.target.value);
  };
  const handleReplyTextChange = (e) => {
    setReplyText(e.target.value);
  };
  const handleDiscard = () => {
    setForwardMessageBox(false);
  };
  const handleReplyDiscard = () => {
    setReplyMessageBox(false);
  };
  const forwardMessage = async (event) => {
    event.preventDefault();
    setEmailText("");
    try {
      const userId = profile.email;
      const accessToken = token;

      const apiUrl = `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/send`;

      const subject = `Fwd: ${
        content &&
        content.payload.headers.find((item) => item.name === "Subject").value
      }`;

      const emailContent = `To: ${emailText}\r\nSubject: ${subject}\r\nIn-Reply-To: ${
        content.id
      }\r\nFrom: ${
        profile.email
      }\r\nMIME-Version: 1.0;\r\nContent-Type: text/html;\r\n\r\n${atob(
        htmlContent.body.data.replace(/-/g, "+").replace(/_/g, "/")
      )}`;
      const base64EncodedEmail = btoa(
        unescape(encodeURIComponent(emailContent))
      );

      const emailData = {
        raw: base64EncodedEmail,
      };

      const response = await axios.post(apiUrl, emailData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      alert("message forwarded");
      setForwardMessageBox(false);
    } catch (error) {
      console.error("Error forwarding email:", error.response || error);
    }
  };
  const replyMessage = async (event) => {
    event.preventDefault();
    setReplyText("");
    try {
      const userId = profile.email;
      const accessToken = token;

      const apiUrl = `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/send`;

      const subject = `Re: ${
        content &&
        content.payload.headers.find((item) => item.name === "Subject").value
      }`;
      const replyTo = content.payload.headers.find(
        (header) => header.name === "From"
      ).value;
      const messageId = content.payload.headers.find(
        (header) => header.name === "Message-Id"
      ).value;

      const replyMessage = `To: ${replyTo}\r\nSubject: ${subject}\r\nReferences: ${messageId}\r\nIn-Reply-To: ${messageId}\r\n\r\n${replyText}`;

      const base64EncodedEmail = btoa(
        unescape(encodeURIComponent(replyMessage))
      );

      const emailData = {
        threadId: content.threadId,
        raw: base64EncodedEmail,
      };

      const response = await axios.post(apiUrl, emailData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("raw data is : ", base64EncodedEmail);
      alert("successfully replied ", response);
      setReplyMessageBox(false);
    } catch (error) {
      console.log(" error while replying: ", error.message);
    }
  };
  // const openAttachmentInNewTab = (blob) => {
  //   const url = URL.createObjectURL(blob);
  //   window.open(url, "_blank");
  // };

  return (
    <>
      <div className="w-full bg-white flex flex-col gap-4 border-black border-[1px] rounded-md">
        {htmlContent && (
          <div className="flex flex-col gap-4 p-4 ">
            <div className="flex gap-4 items-center">
              <button className={btnStyle} onClick={() => navigate(-1)}>
                back
              </button>
              <div className="text-black">
                <span className="font-extrabold mr-4">Subject: </span>
                {content &&
                  content.payload.headers.filter(
                    (item) => item.name === "Subject"
                  )[0].value}
                {content && console.log("content object: ", content)}
              </div>
            </div>

            <div
              className=""
              dangerouslySetInnerHTML={{
                __html: atob(
                  htmlContent.body.data.replace(/-/g, "+").replace(/_/g, "/")
                ),
              }}
            />
            {!attachmentsLoading ? (
              attachmentResponses.length > 0 && (
                <div className="flex gap-8 flex-wrap mt-8">
                  {attachmentResponses.map((attachmentResponse, index) => {
                    const attachment = content.payload.parts[index + 1];
                    console.log("attachment is : ", attachment);
                    const encodedData = attachmentResponse.data.data; // Assuming encoded data
                    const decodedData = atob(
                      encodedData.replace(/-/g, "+").replace(/_/g, "/")
                    );
                    let url;
                    try {
                      const byteNumbers = new Array(decodedData.length);
                      for (let i = 0; i < decodedData.length; i++) {
                        byteNumbers[i] = decodedData.charCodeAt(i);
                      }
                      const byteArray = new Uint8Array(byteNumbers);
                      if (byteArray.length === 0) {
                        console.error("Error: Byte array is empty");
                        return null;
                      }
                      const blob = new Blob([byteArray], {
                        type: "application/octet-stream",
                      });
                      url = URL.createObjectURL(blob);
                      console.log("url: ", url);
                    } catch (error) {
                      console.error("Error decoding base64:", error);
                      return null; // Return null or handle the error accordingly
                    }
                    return (
                      <div key={index} className="p-4 border-2 rounded-md w-48">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className=" flex flex-col gap-3"
                        >
                          <p>{attachment.filename}</p>
                          {attachment.mimeType &&
                            attachment.mimeType.startsWith("image/") && (
                              <img
                                src={url}
                                alt={attachment.filename}
                                style={{
                                  maxWidth: "100%",
                                  borderRadius: "8px",
                                }}
                              />
                            )}
                          Download item
                          {attachment.mimeType &&
                            attachment.mimeType === "application/pdf" && (
                              <embed src={url} type="application/pdf" />
                            )}
                        </a>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <p>loading attachments </p>
            )}
            <div className="flex gap-4 mt-8">
              <button className={btnStyle} onClick={handleReply}>
                Reply
              </button>
              <button className={btnStyle} onClick={handleForward}>
                Forward
              </button>
            </div>
            {forwardMessageBox && (
              <div className="flex flex-col gap-4 mt-4 p-4 border-[1px] border-gray-400 rounded-lg">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Forwarding To</label>
                  <button className={btnStyle} onClick={handleDiscard}>
                    Discard
                  </button>
                </div>
                <form
                  className="flex justify-between items-center"
                  onSubmit={forwardMessage}
                >
                  <input
                    value={emailText}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email"
                    className="p-3 outline-none border-[1px] border-gray-300 min-w-[40%] rounded-lg"
                  />
                  <button className={btnStyle}>Forward Message</button>
                </form>
              </div>
            )}
            {replyMessageBox && (
              <div className="flex flex-col gap-4 mt-4 p-4 border-[1px] border-gray-400 rounded-lg">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Reply Text</label>
                  <button className={btnStyle} onClick={handleReplyDiscard}>
                    Discard
                  </button>
                </div>
                <form
                  className="flex justify-between items-end"
                  onSubmit={replyMessage}
                >
                  <textarea
                    rows="3"
                    value={replyText}
                    onChange={handleReplyTextChange}
                    type="text"
                    placeholder="Your Text Message"
                    className="p-3 outline-none border-[1px] border-gray-300 w-[80%] rounded-lg"
                  />
                  <button className={btnStyle}>Reply</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default SingleMessageItem;
