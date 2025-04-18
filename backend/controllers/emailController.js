const Email = require("../models/Email");

// Send a new email
exports.sendEmail = async (req, res) => {
  try {
    const { to, from, subject, content } = req.body;

    // Basic validation
    if (!to || !from || !subject || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new email
    const email = new Email({
      to,
      from,
      subject,
      content,
      sentAt: new Date(),
    });

    await email.save();
    res.status(201).json({ message: "Email sent successfully", email });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
};

// Get received emails for a user
exports.getReceivedEmails = async (req, res) => {
  try {
    const { email } = req.query;
    const emails = await Email.find({ to: email })
      .sort({ sentAt: -1 })
      .limit(50); // Limit to last 50 emails for performance

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
    const emails = await Email.find({ from: email })
      .sort({ sentAt: -1 })
      .limit(50); // Limit to last 50 emails for performance

    res.json(emails);
  } catch (error) {
    console.error("Error fetching sent emails:", error);
    res.status(500).json({ message: "Error fetching emails" });
  }
};

// Mark email as read
exports.markAsRead = async (req, res) => {
  try {
    const { emailId } = req.params;
    const email = await Email.findByIdAndUpdate(
      emailId,
      { read: true },
      { new: true }
    );

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json(email);
  } catch (error) {
    console.error("Error marking email as read:", error);
    res.status(500).json({ message: "Error updating email" });
  }
};
