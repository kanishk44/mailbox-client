import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const EmailList = ({ folder }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);

  useEffect(() => {
    fetchEmails();
  }, [folder]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("email");

      let endpoint = "/api/emails/received";
      if (folder === "sent") {
        endpoint = "/api/emails/sent";
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: userEmail },
      });

      setEmails(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch emails");
      console.error("Error fetching emails:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmail = (emailId) => {
    setSelectedEmails((prev) =>
      prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectAll = () => {
    setSelectedEmails(
      selectedEmails.length === emails.length
        ? []
        : emails.map((email) => email._id)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="flex-1 bg-white">
      {/* Toolbar */}
      <div className="border-b p-4 flex items-center space-x-4">
        <input
          type="checkbox"
          checked={selectedEmails.length === emails.length}
          onChange={handleSelectAll}
          className="h-4 w-4 text-blue-600"
        />
        <button className="text-gray-600 hover:text-gray-800">
          <span className="mr-2">🗑️</span>
          Delete
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <span className="mr-2">📁</span>
          Archive
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <span className="mr-2">⚠️</span>
          Spam
        </button>
      </div>

      {/* Email List */}
      <div className="divide-y">
        {emails.map((email) => (
          <div
            key={email._id}
            className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
              !email.read ? "font-semibold bg-blue-50" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selectedEmails.includes(email._id)}
              onChange={() => handleSelectEmail(email._id)}
              className="h-4 w-4 text-blue-600 mr-4"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm truncate">
                  {folder === "sent"
                    ? `To: ${email.to}`
                    : `From: ${email.from}`}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(email.sentAt), "MMM d, h:mm a")}
                </span>
              </div>
              <div className="text-sm font-medium truncate">
                {email.subject}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {email.content.replace(/<[^>]*>/g, "")}
              </div>
            </div>
          </div>
        ))}

        {emails.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No emails found in this folder
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;
