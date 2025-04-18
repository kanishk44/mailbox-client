import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Sidebar = ({ currentFolder }) => {
  const navigate = useNavigate();
  const [unreadCounts, setUnreadCounts] = useState({
    inbox: 0,
    unread: 0,
    spam: 0,
  });

  useEffect(() => {
    fetchUnreadCounts();
  }, [currentFolder]);

  const fetchUnreadCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/emails/unread-counts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCounts(response.data);
    } catch (err) {
      console.error("Error fetching unread counts:", err);
    }
  };

  const folders = [
    { name: "Inbox", path: "/inbox", icon: "📥", count: unreadCounts.inbox },
    { name: "Unread", path: "/unread", icon: "📩", count: unreadCounts.unread },
    { name: "Starred", path: "/starred", icon: "⭐" },
    { name: "Drafts", path: "/drafts", icon: "📝" },
    { name: "Sent", path: "/sent", icon: "📤" },
    { name: "Archive", path: "/archive", icon: "📁" },
    { name: "Spam", path: "/spam", icon: "⚠️", count: unreadCounts.spam },
    { name: "Trash", path: "/trash", icon: "🗑️" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Compose Button */}
      <div className="p-4">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("compose-email"))}
          className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span className="mr-2">✏️</span>
          Compose
        </button>
      </div>

      {/* Folders */}
      <nav className="mt-2 flex-1">
        {folders.map((folder) => (
          <Link
            key={folder.path}
            to={folder.path}
            className={`flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 ${
              folder.path.slice(1) === currentFolder
                ? "bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600"
                : ""
            }`}
          >
            <span className="mr-3 text-lg">{folder.icon}</span>
            <span className="flex-1">{folder.name}</span>
            {folder.count > 0 && (
              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {folder.count}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
            {localStorage.getItem("email")?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {localStorage.getItem("email")}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <span className="mr-2">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
