import { useEffect, useState } from "react";
import buffer from "buffer";

import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const SingleMessageItem = () => {
  const navigate = useNavigate();
  const [emailText, setEmailText] = useState("");
  const { profile, token } = useSelector((state) => state.user);
  const [forwardMessageBox, setForwardMessageBox] = useState(false);
  const [htmlContent, setHtmlContent] = useState(null);
  const [attachmentId, setAttachmentId] = useState([]);
  const [files, setFiles] = useState(null);
  const location = useLocation();
  const content = location.state.content || "no content";
  const btnStyle =
    "w-fit text-black hover:bg-gray-300 px-6 py-1 rounded-md border-[2px]";
  useEffect(() => {
    const expandComponent = () => {
      if (content.payload.body.size > 0) {
        setHtmlContent(content.payload);
      } else if (content.payload.mimeType === "multipart/mixed") {
        console.log("mixed data: ", content.payload.parts);
        // setPlainContent(content.payload.parts[0].parts[0]);
        setHtmlContent(content.payload.parts[0].parts[1]);
        setAttachmentId(content.payload.parts[1].body.attachmentId);
      }
      // if(content.payload.mimeType === "multipart/alternative")
      else {
        console.log("mimetype is : ", content.payload.mimeType);
        console.log("content is: ");
        setHtmlContent(content.payload.parts[1]);
        // setPlainContent(content.payload.parts[0]);
      }
    };
    expandComponent();
  }, [content]);

  const handleForward = () => {
    setForwardMessageBox(true);
  };
  const handleChange = (e) => {
    setEmailText(e.target.value);
  };
  const handleDiscard = () => {
    setForwardMessageBox(false);
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
        content.payload.headers.filter((item) => item.name === "Subject")[0]
          .value
      }`;

      // const emailContent = `To: ${emailText}\r\nSubject: ${subject}\r\nIn-Reply-To: ${content.id}\r\nFrom: ${profile.email}\r\nthis is the email content
      // `;
      // const base64EncodedEmail = btoa(
      //   unescape(encodeURIComponent(emailContent)),
      // );
      const emailContent = `To: ${emailText}\r\nSubject: ${subject}\r\nIn-Reply-To: ${content.id}\r\nFrom: ${profile.email}\r\nthis is the email content\r\nMIME-Version: 1.0\r\nContent-Transfer-Encoding: base64\r\n\r\n`;

      const base64EncodedEmail = btoa(
        unescape(encodeURIComponent(emailContent)),
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

      console.log("Email forwarded successfully:", response.data);
      console.log("raw data is : ", emailData.raw);
      alert("message forwarded");
      setForwardMessageBox(false);
    } catch (error) {
      console.error("Error forwarding email:", error.response || error);
    }
  };

  // const getAttachment = () => {
  //   axios
  //     .get(
  //       `https://gmail.googleapis.com/gmail/v1/users/${profile.email}/messages/${content.id}/attachments/${attachmentId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: "application/json",
  //         },
  //         params: {
  //           format: "full",
  //         },
  //       },
  //     )
  //     .then(
  //       (response) => setFiles(response.data.data),
  //       // replace(/-/g, "+").replace(/_/g, "/")
  //     );
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
                    (item) => item.name === "Subject",
                  )[0].value}
                {content && console.log("content object: ", content)}
              </div>
            </div>

            <div
              className=""
              dangerouslySetInnerHTML={{
                __html: atob(
                  htmlContent.body.data.replace(/-/g, "+").replace(/_/g, "/"),
                ),
              }}
            />
            <div className="flex gap-4 mt-4">
              <button className={btnStyle}>Reply</button>
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
          </div>
        )}
      </div>
    </>
  );
};
export default SingleMessageItem;
