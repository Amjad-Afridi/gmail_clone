import { useState } from "react";
function NewMessage() {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [textarea, setTextarea] = useState("");
  const [showMessage, setShowMessage] = useState(true);
  const commonFormsStyles = "border-b-[1px] pb-2 outline-none ";

  const submitForm = (event) => {
    event.preventDefault();
    setRecipients("");
    setTextarea("");
    setSubject("");
  };

  const hideMessageBox = () => {
    setShowMessage(false);
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
  const handleFocus = (e) => {
    setRecipients("To:  ");
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
              type="text"
              className={commonFormsStyles}
              placeholder="Recipients"
              value={recipients}
              onFocus={handleFocus}
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
