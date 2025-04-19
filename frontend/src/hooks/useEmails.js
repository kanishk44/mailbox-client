import { useState, useCallback } from "react";
import axios from "axios";

export const useEmails = (folder) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmails = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }
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

        setEmails((prevEmails) => {
          if (prevEmails.length !== response.data.length) {
            return response.data;
          }

          const hasChanges = response.data.some((newEmail, index) => {
            const oldEmail = prevEmails[index];
            return (
              !oldEmail ||
              oldEmail._id !== newEmail._id ||
              oldEmail.read !== newEmail.read
            );
          });

          return hasChanges ? response.data : prevEmails;
        });
        setError("");
      } catch (err) {
        console.error("Error fetching emails:", err);
        setError("Failed to fetch emails");
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [folder]
  );

  const markAsRead = async (emailId) => {
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("email");

      const response = await axios.put(
        `/api/emails/${emailId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { email: userEmail },
        }
      );

      setEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === emailId ? { ...email, read: true } : email
        )
      );

      return response.data;
    } catch (err) {
      console.error("Error marking email as read:", err);
      throw err;
    }
  };

  const deleteEmail = async (emailId) => {
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("email");

      await axios.delete(`/api/emails/${emailId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: userEmail },
      });

      setEmails((prevEmails) =>
        prevEmails.filter((email) => email._id !== emailId)
      );
    } catch (err) {
      console.error("Error deleting email:", err);
      throw err;
    }
  };

  return {
    emails,
    loading,
    error,
    fetchEmails,
    markAsRead,
    deleteEmail,
  };
};
