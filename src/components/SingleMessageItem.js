import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const SingleMessageItem = () => {
  const navigate = useNavigate();
  const { profile, token } = useSelector((state) => state.user);
  const [htmlContent, setHtmlContent] = useState(null);
  const [plainContent, setPlainContent] = useState(null);
  const [attachmentId, setAttachmentId] = useState([]);
  const [files, setFiles] = useState(null);
  const location = useLocation();
  const content = location.state.content;
  const btnStyle =
    "w-fit text-black hover:bg-gray-300 px-4 py-2 rounded-md border-[2px]";
  useEffect(() => {
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
    expandComponent();
  }, [content]);
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
      <div className="w-[80%] bg-white flex flex-col gap-4 border-black border-[1px] rounded-md">
        {/*{plainContent && (*/}
        {/*  <code className="w-[60%] p-4 font-normal text-black">*/}
        {/*    {atob(plainContent.body.data.replace(/-/g, "+").replace(/_/g, "/"))}*/}
        {/*  </code>*/}
        {/*)}*/}
        {htmlContent && (
          <div className="flex flex-col gap-4 p-4 ">
            <div className="flex gap-4 items-center">
              <button className={btnStyle} onClick={() => navigate(-1)}>
                back
              </button>
              <div className="text-black">
                <span className="font-extrabold">Subject: </span>
                {content &&
                  content.payload.headers.filter(
                    (item) => item.name === "Subject",
                  )[0].value}
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
              <button className={btnStyle}>Forward</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default SingleMessageItem;
