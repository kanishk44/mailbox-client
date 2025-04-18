import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ currentFolder }) => {
  const navigate = useNavigate();

  const folders = [
    { name: "Inbox", path: "/inbox", icon: "📥" },
    { name: "Unread", path: "/unread", icon: "📩" },
    { name: "Starred", path: "/starred", icon: "⭐" },
    { name: "Drafts", path: "/drafts", icon: "📝" },
    { name: "Sent", path: "/sent", icon: "📤" },
    { name: "Archive", path: "/archive", icon: "📁" },
    { name: "Spam", path: "/spam", icon: "⚠️" },
    { name: "Trash", path: "/trash", icon: "🗑️" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-4">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("compose-email"))}
          className="w-full bg-blue-500 text-white rounded-md py-2 px-4 flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          <span className="mr-2">✏️</span>
          Compose
        </button>
      </div>

      <nav className="mt-4 flex-1">
        {folders.map((folder) => (
          <Link
            key={folder.path}
            to={folder.path}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              folder.path.slice(1) === currentFolder
                ? "bg-blue-50 text-blue-600 font-medium"
                : ""
            }`}
          >
            <span className="mr-3">{folder.icon}</span>
            <span>{folder.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <span className="mr-2">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
