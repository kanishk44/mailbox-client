import { useState, useEffect } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ComposeEmail = () => {
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSend = async () => {
    if (!to || !subject) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSending(true);
      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      const senderEmail = localStorage.getItem("email");
      const token = localStorage.getItem("token");

      const emailData = {
        to,
        subject,
        content: JSON.stringify(rawContent),
        from: senderEmail,
        sentAt: new Date().toISOString(),
      };

      await axios.post("/api/emails/send", emailData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/sent");
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setError(error.response?.data?.message || "Failed to send email");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {/* To field */}
          <div>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Subject field */}
          <div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Editor */}
          <div className="border border-gray-300 rounded-md">
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class p-4 min-h-[300px]"
              toolbarClassName="toolbar-class"
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "list",
                  "textAlign",
                  "link",
                  "emoji",
                  "image",
                  "history",
                ],
                inline: { inDropdown: false },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: false },
              }}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Send button */}
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={sending}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                sending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeEmail;
