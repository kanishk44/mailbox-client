import { useState, useEffect } from "react";
import api from "../api/axios";

export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("email");

      const response = await api.get("/api/emails/unread-counts", {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: userEmail },
      });

      setUnreadCount(response.data.inbox);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 2000);
    return () => clearInterval(interval);
  }, []);

  return unreadCount;
};
