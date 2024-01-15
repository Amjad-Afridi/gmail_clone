import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Document, Page } from "react-pdf";
import { useNavigate } from "react-router-dom";

const MessageItem = ({ content }) => {
  const navigate = useNavigate();
  const { profile, token } = useSelector((state) => state.user);
  const handleClick = () => {
    navigate("/message-item", { state: { content } });
  };
  return (
    <>
      <div
        className="flex w-full p-2 border-b-[1px] border-l-[1px] border-gray-400 hover:shadow-lg rounded-md hover:rounded-full hover:cursor-pointer"
        onClick={handleClick}
      >
        {content.payload.headers.find((item) => item.name === "Subject")
          .value ? (
          <div className="flex flex-row w-full">
            <span className="min-w-[25%]">
              {
                content.payload.headers
                  .find((item) => item.name === "From")
                  .value.split(" ")[0]
              }
            </span>
            <p>
              {
                content.payload.headers.find((item) => item.name === "Subject")
                  .value
              }
            </p>
          </div>
        ) : (
          "From:  " +
          content.payload.headers.find((item) => item.name === "From").value
        )}
      </div>
      <br />
    </>
  );
};

export default MessageItem;
