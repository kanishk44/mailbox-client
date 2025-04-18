const express = require("express");
const router = express.Router();
const {
  sendEmail,
  getReceivedEmails,
  getSentEmails,
  markAsRead,
  getUnreadCounts,
} = require("../controllers/emailController");
const auth = require("../middleware/auth"); // Assuming you have auth middleware

// All routes should be protected with auth middleware
router.post("/send", auth, sendEmail);
router.get("/received", auth, getReceivedEmails);
router.get("/sent", auth, getSentEmails);
router.put("/:id/read", auth, markAsRead);
router.get("/unread-counts", auth, getUnreadCounts);

module.exports = router;
