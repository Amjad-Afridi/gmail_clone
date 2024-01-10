import { HiInbox } from "react-icons/hi";
import { FaRegStar } from "react-icons/fa";
import { MdAccessAlarm } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { RiDraftLine } from "react-icons/ri";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { HiOutlinePencil } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const items = [
    {
      id: 1,
      title: "Inbox",
      icon: <HiInbox size={22} />,
    },
    {
      id: 2,
      title: "Starred",
      icon: <FaRegStar size={20} />,
    },
    {
      id: 3,
      title: "Snoozed",
      icon: <MdAccessAlarm size={22} />,
    },
    {
      id: 4,
      title: "Sent",
      icon: <IoMdSend size={20} />,
    },
    {
      id: 5,
      title: "Drafts",
      icon: <RiDraftLine size={20} />,
    },
    {
      id: 6,
      title: "More",
      icon: <MdExpandMore size={25} />,
    },
  ];
  return (
    <>
      <button
        className="flex items-center gap-4 px-4 py-3 my-4 ml-2  rounded-xl bg-blue-200 font-medium hover:drop-shadow-lg "
        onClick={() => navigate("/message")}
      >
        <HiOutlinePencil />
        Compose
      </button>
      <div className="flex flex-col  w-1/6">
        {items.map((item) => {
          return (
            <div className="flex items-center justify-start gap-4 px-4 py-2 rounded-r-full hover:bg-gray-300">
              <div>{item.icon}</div>
              <div
                className="text-black font-normal"
                onClick={() => navigate("/messagelist")}
              >
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Sidebar;
