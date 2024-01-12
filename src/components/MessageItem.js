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
        className="flex w-full p-2 border-b-[1px] border-gray-400 hover:shadow-lg hover:rounded-full "
        onClick={handleClick}
      >
        {content.snippet !== ""
          ? content.snippet
          : content.payload.headers.filter((item) => item.name === "From")[0]
              .value}
      </div>
      <br />
    </>
  );
};

export default MessageItem;
