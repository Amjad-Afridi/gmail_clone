import { HiInbox } from "react-icons/hi";
import { FaRegStar } from "react-icons/fa";
import { MdAccessAlarm } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { RiDraftLine } from "react-icons/ri";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { HiOutlinePencil } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageList } from "../Redux/Thunks/MessageList";
import { useSelector, useDispatch } from "react-redux";
import { logoutInfo } from "../Redux/Slices/UserSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { profile, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    {
      id: 1,
      title: "Inbox",
      icon: <HiInbox size={22} />,
    },
    {
      id: 2,
      title: "Sent",
      icon: <IoMdSend size={20} />,
    },
    {
      id: 3,
      title: "Unread",
      icon: <RiDraftLine size={20} />,
    },
    {
      id: 4,
      title: "Logout",
      icon: <AiOutlineLogout />,
    },
  ];
  const handleInbox = () => {
    const query = "is:inbox";
    dispatch(MessageList({ profile, token, query }));
    navigate("/messages-list");
  };
  const handleSentMessages = () => {
    const query = "is:sent";
    dispatch(MessageList({ profile, token, query }));
    navigate("/sent-messages-list");
  };
  const handleUnreadMessages = () => {
    const query = "is:unread";
    dispatch(MessageList({ profile, token, query }));
    navigate("/unread-messages-list");
  };
  const handleLogout = () => {
    dispatch(logoutInfo());
    navigate("/login");
  };
  return (
    <div className="w-1/6">
      <button
        className="flex items-center gap-4 px-4 py-3 my-4 ml-2  rounded-xl bg-blue-200 font-medium hover:drop-shadow-lg "
        onClick={() => navigate("/message")}
      >
        <HiOutlinePencil />
        Compose
      </button>
      <div className="flex flex-col ">
        {items.map((item) => {
          return (
            <div className="flex items-center justify-start gap-4 px-4 py-2 rounded-r-full hover:bg-gray-300 active:bg-gray-300 ">
              <div>{item.icon}</div>
              <div
                className="text-black font-normal"
                onClick={() =>
                  (item.id === 1 && handleInbox()) ||
                  (item.id === 2 && handleSentMessages()) ||
                  (item.id === 3 && handleUnreadMessages()) ||
                  (item.id === 4 && handleLogout())
                }
                key={item.id}
              >
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;
