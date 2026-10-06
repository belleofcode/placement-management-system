const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "company", "admin"], required: true },
  student: {
    rollNo: String,
    branch: String,
    graduationYear: Number,
    cgpa: Number,
    backlogs: { type: Number, default: 0 },
    skills: [String],
    phone: String
  },
  company: {
    website: String,
    industry: String,
    description: String
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
