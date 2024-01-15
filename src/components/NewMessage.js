import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FilePicker from "./FilePicker";
function NewMessage() {
  const { token, profile } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [textarea, setTextarea] = useState("");
  const [showMessage, setShowMessage] = useState(true);
  const [files, setFiles] = useState([]);
  const commonFormsStyles = "border-b-[1px] pb-2 outline-none ";

  const handleFileSelected = (files) => {
    console.log("Selected files are: ", files);
    setFiles(files);
  };

  async function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  const submitForm = async (event) => {
    event.preventDefault();

    {
      try {
        const userId = profile.email;
        const accessToken = token;

        const apiUrl = `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/send`;

        const boundary = "myboundary";
        const subjectAndRecipients = `To: ${recipients}\r\nSubject: ${subject}\r\n`;

        const body = `${subjectAndRecipients}\r\nContent-Type: multipart/mixed; boundary=${boundary}\r\n\r\n--${boundary}\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${textarea}\r\n`;

        const attachments = await Promise.all(
          files.map(async (file) => {
            const content = await readFileAsBase64(file); // Read file content and convert to
            return {
              filename: file.name,
              content: content,
              type: file.type,
            };
          })
        );

        // Constructing attachments
        const attachmentContent = attachments
          .map(
            (attachment) => `
    --${boundary}\r\nContent-Type: ${attachment.type}; name="${attachment.filename}"\r\nContent-Disposition: attachment; filename="${attachment.filename}"\r\nContent-Transfer-Encoding: base64\r\n\r\n${attachment.content}\r\n`
          )
          .join("");

        const closingBoundary = `--${boundary}--\r\n`;

        const emailContent = `${body}${attachmentContent}${closingBoundary}`;

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
        console.log("message sent with response !", response.data);
      } catch (error) {
        console.error(error.message);
      }
    }
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
            <div className="flex gap-4 items-center">
              <button className="bg-blue-700 hover:bg-blue-500 px-4 py-1 rounded-full text-white font-medium w-fit">
                Send
              </button>
              <div>
                <FilePicker onFileSelected={handleFileSelected} />
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
export default NewMessage;
