const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    from: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
    folder: {
      type: String,
      required: true,
      enum: ["inbox", "sent"],
      default: "inbox",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster querying
emailSchema.index({ to: 1 });
emailSchema.index({ from: 1 });
emailSchema.index({ folder: 1 });

module.exports = mongoose.model("Email", emailSchema);
