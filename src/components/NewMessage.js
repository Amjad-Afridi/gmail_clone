import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function NewMessage() {
  const { token, profile } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [textarea, setTextarea] = useState("");
  const [showMessage, setShowMessage] = useState(true);
  const commonFormsStyles = "border-b-[1px] pb-2 outline-none ";

  const submitForm = async (event) => {
    event.preventDefault();
    console.log(" token is: ", token);
    console.log(" profile: ", profile);

    try {
      const userId = profile.email; // Replace with the actual user ID
      const accessToken = token; // Replace with the actual access token

      const apiUrl = `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/send`;

      const emailContent = `To: ${recipients}\r\nSubject: ${subject}\r\n\r\n${textarea}
      `;

      // Encoding the email content in base64
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

      console.log("Email sent successfully:", response.data);
      alert("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error.response || error);
    }

    // console.log("result after sending email ", response);
    setRecipients("");
    setTextarea("");
    setSubject("");
    navigate(-1);
  };

  const hideMessageBox = () => {
    setShowMessage(false);
    navigate(-1);
  };
  const handleTextAreaChange = (e) => {
    setTextarea(e.target.value);
  };
  const handleRecipientsChange = (e) => {
    setRecipients(e.target.value);
  };
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  return (
    <>
      {showMessage && (
        <div className="flex flex-col absolute bottom-0 right-8 w-1/3 bg-white rounded-lg">
          <div className="flex justify-between items-center p-4 font-medium bg-gray-200 rounded-t-lg">
            <div>New Message</div>
            <button onClick={hideMessageBox}>X</button>
          </div>
          <form onSubmit={submitForm} className="flex flex-col gap-3 p-4">
            <input
              required
              type="email"
              className={commonFormsStyles}
              placeholder="Recipient"
              value={recipients}
              onChange={handleRecipientsChange}
            />
            <input
              type="text"
              className={commonFormsStyles}
              placeholder="Subject"
              value={subject}
              onChange={handleSubjectChange}
            />
            <textarea
              name=""
              rows="12"
              className={commonFormsStyles + "border-b-[0px]"}
              value={textarea}
              onChange={handleTextAreaChange}
            ></textarea>
            <button className="bg-blue-700 hover:bg-blue-500 px-4 py-1 rounded-full text-white font-medium w-fit">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
export default NewMessage;
