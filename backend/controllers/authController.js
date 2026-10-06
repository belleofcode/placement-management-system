const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const safeUser = (u) => ({
  id: u._id, name: u.name, email: u.email, role: u.role,
  student: u.student, company: u.company
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, student, company } = req.body;
    if (!["student", "company"].includes(role)) return res.status(400).json({ message: "Invalid role" });
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, student, company });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: safeUser(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || "", user.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: safeUser(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(safeUser(user));
};
