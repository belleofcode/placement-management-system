const mongoose = require("mongoose");

let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing");
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
      connectionPromise = null;
      throw err;
    });
  }
  await connectionPromise;
  return mongoose.connection;
}

module.exports = connectDB;
