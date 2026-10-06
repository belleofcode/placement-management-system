const User = require("../models/User");
const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");

exports.stats = async (req, res) => {
  const [students, companies, opportunities, applications, selected] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "company" }),
    Opportunity.countDocuments(),
    Application.countDocuments(),
    Application.countDocuments({ status: "Selected" })
  ]);
  res.json({ students, companies, opportunities, applications, selected });
};

exports.users = async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } }).select("-password").sort({ createdAt: -1 });
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role === "admin") return res.status(404).json({ message: "User not found" });
  await User.findByIdAndDelete(user._id);
  if (user.role === "student") await Application.deleteMany({ student: user._id });
  if (user.role === "company") {
    const ops = await Opportunity.find({ company: user._id }).select("_id");
    await Application.deleteMany({ opportunity: { $in: ops.map(o => o._id) } });
    await Opportunity.deleteMany({ company: user._id });
  }
  res.json({ message: "User deleted" });
};
