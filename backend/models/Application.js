const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Selected", "Rejected"],
    default: "Applied"
  }
}, { timestamps: true });

applicationSchema.index({ opportunity: 1, student: 1 }, { unique: true });
module.exports = mongoose.model("Application", applicationSchema);
