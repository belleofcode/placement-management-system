const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");
const User = require("../models/User");

exports.list = async (req, res) => {
  const filter = req.user.role === "company" ? { company: req.user.id } : {};
  const items = await Opportunity.find(filter).populate("company", "name company").sort({ createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const item = await Opportunity.create({ ...req.body, company: req.user.id });
    res.status(201).json(item);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.update = async (req, res) => {
  const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, company: req.user.id };
  const item = await Opportunity.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Opportunity not found" });
  res.json(item);
};

exports.remove = async (req, res) => {
  const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, company: req.user.id };
  const item = await Opportunity.findOneAndDelete(filter);
  if (!item) return res.status(404).json({ message: "Opportunity not found" });
  await Application.deleteMany({ opportunity: item._id });
  res.json({ message: "Opportunity deleted" });
};

exports.apply = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    const op = await Opportunity.findById(req.params.id);
    if (!op || op.status !== "Open" || new Date(op.deadline) < new Date())
      return res.status(400).json({ message: "This drive is not open" });

    const s = student.student || {};
    const eligible =
      Number(s.cgpa || 0) >= Number(op.minCGPA || 0) &&
      Number(s.backlogs || 0) <= Number(op.maxBacklogs || 0) &&
      (!op.graduationYear || Number(s.graduationYear) === Number(op.graduationYear)) &&
      (!op.eligibleBranches?.length || op.eligibleBranches.includes(s.branch));

    if (!eligible) return res.status(400).json({ message: "You do not meet this drive's eligibility criteria" });
    const app = await Application.create({ opportunity: op._id, student: req.user.id });
    res.status(201).json(app);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "You already applied" });
    res.status(400).json({ message: e.message });
  }
};

exports.myApplications = async (req, res) => {
  const apps = await Application.find({ student: req.user.id })
    .populate({ path: "opportunity", populate: { path: "company", select: "name" } })
    .sort({ createdAt: -1 });
  res.json(apps);
};

exports.applicants = async (req, res) => {
  const op = await Opportunity.findById(req.params.id);
  if (!op) return res.status(404).json({ message: "Opportunity not found" });
  if (req.user.role === "company" && String(op.company) !== req.user.id)
    return res.status(403).json({ message: "Access denied" });
  const apps = await Application.find({ opportunity: op._id }).populate("student", "name email student");
  res.json(apps);
};

exports.updateApplication = async (req, res) => {
  const app = await Application.findById(req.params.applicationId).populate("opportunity");
  if (!app) return res.status(404).json({ message: "Application not found" });
  if (req.user.role === "company" && String(app.opportunity.company) !== req.user.id)
    return res.status(403).json({ message: "Access denied" });
  app.status = req.body.status;
  await app.save();
  res.json(app);
};
