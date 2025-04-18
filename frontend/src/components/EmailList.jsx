import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useEmails } from "../hooks/useEmails";

const EmailList = ({ folder, onEmailSelect, selectedEmailId }) => {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);

  const { emails, loading, error, fetchEmails, markAsRead, deleteEmail } =
    useEmails(folder);

  // Initial fetch
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Setup polling
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchEmails(false); // Don't show loading state during polling
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [fetchEmails]);

  const handleDelete = async (emailId) => {
    try {
      await deleteEmail(emailId);
      setEmailToDelete(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Error deleting email:", err);
    }
  };

  const handleDeleteClick = (email, e) => {
    e.stopPropagation(); // Prevent email selection
    setEmailToDelete(email);
    setShowDeleteConfirm(true);
  };

  const handleEmailClick = async (email, e) => {
    // If clicking checkbox, don't select the email
    if (e.target.type === "checkbox") return;

    // Only mark as read if it's in the inbox and unread
    if (folder === "inbox" && !email.read) {
      try {
        await markAsRead(email._id);
      } catch (error) {
        console.error("Failed to mark email as read:", error);
      }
    }

    onEmailSelect(email);
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
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this email?
              {emailToDelete && (
                <span className="block mt-2 text-sm text-gray-500">
                  Subject: {emailToDelete.subject}
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setEmailToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(emailToDelete._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="border-b border-gray-200 p-4 flex items-center space-x-4 bg-white">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={selectedEmails.length === emails.length}
            onChange={handleSelectAll}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              if (selectedEmails.length > 0) {
                setEmailToDelete({
                  _id: selectedEmails[0],
                  subject: "multiple emails",
                });
                setShowDeleteConfirm(true);
              }
            }}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full"
          >
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
        </div>
      </div>

      {/* Email List */}
      <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
        {error && <div className="p-4 text-red-600 bg-red-50">{error}</div>}

        {emails.map((email) => (
          <div
            key={email._id}
            onClick={(e) => handleEmailClick(email, e)}
            className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              folder === "inbox" && !email.read ? "bg-blue-50" : ""
            } ${selectedEmailId === email._id ? "bg-blue-100" : ""}`}
          >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={selectedEmails.includes(email._id)}
                onChange={() => handleSelectEmail(email._id)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              {folder === "inbox" && (
                <div className="relative">
                  {!email.read && (
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm truncate ${
                      folder === "inbox" && !email.read ? "font-semibold" : ""
                    }`}
                  >
                    {folder === "sent"
                      ? `To: ${email.to}`
                      : `From: ${email.from}`}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {format(new Date(email.sentAt), "MMM d, h:mm a")}
                    </span>
                    <button
                      onClick={(e) => handleDeleteClick(email, e)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                    >
                      <svg
                        className="w-4 h-4"
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
                  </div>
                </div>
                <div
                  className={`text-sm truncate ${
                    folder === "inbox" && !email.read ? "font-semibold" : ""
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

        {emails.length === 0 && !error && (
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
