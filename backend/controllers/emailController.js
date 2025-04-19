const Email = require("../models/Email");

// Send a new email
exports.sendEmail = async (req, res) => {
  try {
    const { to, from, subject, content } = req.body;

    // Basic validation
    if (!to || !from || !subject || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const currentTime = new Date();

    // Create email for recipient's inbox
    const recipientEmail = new Email({
      to,
      from,
      subject,
      content,
      read: false,
      folder: "inbox",
      sentAt: currentTime,
    });

    // Create email for sender's sent folder
    const senderEmail = new Email({
      to,
      from,
      subject,
      content,
      read: true,
      folder: "sent",
      sentAt: currentTime,
    });

    // Save both emails
    await Promise.all([recipientEmail.save(), senderEmail.save()]);

    res
      .status(201)
      .json({ message: "Email sent successfully", email: recipientEmail });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
};

// Get received emails for a user
exports.getReceivedEmails = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    const emails = await Email.find({
      to: email,
      folder: "inbox",
    })
      .sort({ sentAt: -1 })
      .limit(50);

    res.json(emails);
  } catch (error) {
    console.error("Error fetching received emails:", error);
    res.status(500).json({ message: "Error fetching emails" });
  }
};

// Get sent emails for a user
exports.getSentEmails = async (req, res) => {
  try {
    const { email } = req.query;
    const emails = await Email.find({
      from: email,
      folder: "sent",
    })
      .sort({ sentAt: -1 })
      .limit(50);

    res.json(emails);
  } catch (error) {
    console.error("Error fetching sent emails:", error);
    res.status(500).json({ message: "Error fetching emails" });
  }
};

// Mark email as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { email: userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    // Find and update the email in one operation
    const updatedEmail = await Email.findOneAndUpdate(
      { _id: id, to: userEmail },
      { read: true },
      { new: true } // Return the updated document
    );

    if (!updatedEmail) {
      return res.status(404).json({
        message:
          "Email not found or you don't have permission to mark it as read",
      });
    }

    res.json(updatedEmail);
  } catch (error) {
    console.error("Error marking email as read:", error);
    res.status(500).json({ message: "Error updating email" });
  }
};

// Get unread counts
exports.getUnreadCounts = async (req, res) => {
  try {
    const { email: userEmail } = req.query;

    // Get unread count for inbox only
    const inbox = await Email.countDocuments({
      to: userEmail,
      read: false,
      folder: "inbox",
    });

    res.json({ inbox });
  } catch (error) {
    console.error("Error getting unread counts:", error);
    res.status(500).json({ message: "Error getting unread counts" });
  }
};

// Delete email
exports.deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email: userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    // Only allow deletion if the user is either the sender or recipient
    const email = await Email.findOneAndDelete({
      _id: id,
      $or: [{ from: userEmail }, { to: userEmail }],
    });

    if (!email) {
      return res.status(404).json({
        message: "Email not found or you don't have permission to delete it",
      });
    }

    res.json({ message: "Email deleted successfully" });
  } catch (error) {
    console.error("Error deleting email:", error);
    res.status(500).json({ message: "Error deleting email" });
  }
};
