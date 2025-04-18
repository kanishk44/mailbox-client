import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import EmailList from "./EmailList";
import ComposeEmail from "./ComposeEmail";

const MailboxLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isComposeOpen, setIsComposeOpen] = useState(false);

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar currentFolder={folder} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3">
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {folder}
            </h1>
          </div>
        </header>

        {/* Email List */}
        <main className="flex-1 overflow-y-auto">
          <EmailList folder={folder} />
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
