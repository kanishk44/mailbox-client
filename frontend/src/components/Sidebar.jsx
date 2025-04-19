import { Link, useNavigate } from "react-router-dom";
import { useUnreadCount } from "../hooks/useUnreadCount";

const Sidebar = ({ currentFolder }) => {
  const navigate = useNavigate();
  const unreadCount = useUnreadCount();

  const folders = [
    {
      name: "Inbox",
      path: "/inbox",
      icon: (
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
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      unreadCount: unreadCount,
    },
    {
      name: "Sent",
      path: "/sent",
      icon: (
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      ),
    },
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
            {folder.unreadCount > 0 && (
              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {folder.unreadCount}
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
