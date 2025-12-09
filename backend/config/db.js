const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Re-use connection in serverless to avoid multiple sockets
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // In serverless, throw to surface the error instead of exiting
    throw error;
  }
};

module.exports = connectDB;
