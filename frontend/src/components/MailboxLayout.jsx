import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import EmailList from "./EmailList";
import EmailDetail from "./EmailDetail";
import ComposeEmail from "./ComposeEmail";

const MailboxLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Get current folder from path
  const folder = location.pathname.slice(1); // Remove leading slash

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Listen for compose email event
    const handleComposeClick = () => setIsComposeOpen(true);
    window.addEventListener("compose-email", handleComposeClick);

    return () => {
      window.removeEventListener("compose-email", handleComposeClick);
    };
  }, [navigate]);

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentFolder={folder} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                {folder}
              </h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
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
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden bg-white">
          {/* Email List */}
          <div
            className={`${
              selectedEmail ? "hidden md:block md:w-1/2 lg:w-2/5" : "w-full"
            } border-r border-gray-200`}
          >
            <EmailList
              folder={folder}
              onEmailSelect={handleEmailSelect}
              selectedEmailId={selectedEmail?._id}
            />
          </div>

          {/* Email Detail */}
          <div
            className={`${
              selectedEmail ? "w-full md:w-1/2 lg:w-3/5" : "hidden"
            }`}
          >
            <EmailDetail
              email={selectedEmail}
              onClose={() => setSelectedEmail(null)}
            />
          </div>
        </main>
      </div>

      {/* Compose Email Modal */}
      <ComposeEmail
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </div>
  );
};

export default MailboxLayout;
