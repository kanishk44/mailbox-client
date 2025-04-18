import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const EmailList = ({ folder, onEmailSelect, selectedEmailId }) => {
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

  const markAsRead = async (emailId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/emails/${emailId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error marking email as read:", err);
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

  const handleEmailClick = async (email, e) => {
    // If clicking checkbox, don't select the email
    if (e.target.type === "checkbox") return;

    // If email is unread, mark it as read
    if (!email.read) {
      await markAsRead(email._id);
      // Update the email in the local state
      setEmails(
        emails.map((e) => (e._id === email._id ? { ...e, read: true } : e))
      );
    }

    onEmailSelect(email);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <svg
          className="w-12 h-12 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-4 flex items-center space-x-4 bg-white">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={selectedEmails.length === emails.length}
            onChange={handleSelectAll}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Email List */}
      <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
        {emails.map((email) => (
          <div
            key={email._id}
            onClick={(e) => handleEmailClick(email, e)}
            className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              !email.read ? "bg-blue-50" : ""
            } ${selectedEmailId === email._id ? "bg-blue-100" : ""}`}
          >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={selectedEmails.includes(email._id)}
                onChange={() => handleSelectEmail(email._id)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <div className="relative">
                {!email.read && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm truncate ${
                      !email.read ? "font-semibold" : ""
                    }`}
                  >
                    {folder === "sent"
                      ? `To: ${email.to}`
                      : `From: ${email.from}`}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(email.sentAt), "MMM d, h:mm a")}
                  </span>
                </div>
                <div
                  className={`text-sm truncate ${
                    !email.read ? "font-semibold" : ""
                  }`}
                >
                  {email.subject}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {email.content.replace(/<[^>]*>/g, "")}
                </div>
              </div>
            </div>
          </div>
        ))}

        {emails.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg
              className="w-12 h-12 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-lg">No emails found in this folder</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;
