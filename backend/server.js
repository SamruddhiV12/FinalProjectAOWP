const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Attempt initial Mongo connection (non-blocking for serverless)
connectDB().catch((err) => console.error('Initial Mongo connection failed:', err.message));

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use('/uploads', express.static('uploads'));
// Serve temporary upload dir on Vercel (non-persistent)
if (process.env.VERCEL) {
  app.use('/tmp-materials', express.static('/tmp/uploads/materials'));
}

// Simple health before DB middleware to avoid crashing on connection issues
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    env: process.env.NODE_ENV || 'development',
    vercel: !!process.env.VERCEL,
    hasMongoUri: !!process.env.MONGODB_URI,
  });
});

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Ensure DB connection per request (helps in serverless cold starts)
app.use(async (req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err) {
    console.error('Mongo connection error:', err.message);
    return res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/batches', require('./routes/batches'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/class-schedules', require('./routes/classSchedules'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/materials', require('./routes/materials'));
app.use('/api/student-profile', require('./routes/studentProfile'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/tasks', require('./routes/tasks'));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Samruddhi\'s Dance Academy API',
    version: '1.0.0',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        getProfile: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/update-profile',
        updatePassword: 'PUT /api/auth/update-password',
      },
      students: {
        getAll: 'GET /api/students',
        getStats: 'GET /api/students/stats',
        getById: 'GET /api/students/:id',
        update: 'PUT /api/students/:id',
      },
      batches: {
        create: 'POST /api/batches',
        getAll: 'GET /api/batches',
        getStats: 'GET /api/batches/stats',
        getById: 'GET /api/batches/:id',
        update: 'PUT /api/batches/:id',
        addStudent: 'POST /api/batches/:id/students',
        removeStudent: 'DELETE /api/batches/:id/students/:studentId',
      },
      attendance: {
        mark: 'POST /api/attendance',
        getRecords: 'GET /api/attendance',
        getById: 'GET /api/attendance/:id',
        studentSummary: 'GET /api/attendance/student/:studentId/summary',
        batchSummary: 'GET /api/attendance/batch/:batchId/summary',
      },
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Export for serverless (Vercel) and start normally for local/dev
const PORT = process.env.PORT || 5000;

if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
  });
}
