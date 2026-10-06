require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

(async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || "admin@placement.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const hashed = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { email },
    { name: "Placement Admin", email, password: hashed, role: "admin" },
    { upsert: true, new: true }
  );
  console.log(`Admin ready: ${email}`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
