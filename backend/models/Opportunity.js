const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  jobType: { type: String, default: "Full Time" },
  location: { type: String, required: true },
  packageLPA: { type: Number, required: true },
  description: { type: String, required: true },
  skills: [String],
  minCGPA: { type: Number, default: 0 },
  maxBacklogs: { type: Number, default: 0 },
  eligibleBranches: [String],
  graduationYear: Number,
  deadline: { type: Date, required: true },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" }
}, { timestamps: true });

module.exports = mongoose.model("Opportunity", opportunitySchema);
