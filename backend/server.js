const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use('/uploads', express.static('uploads'));

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

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

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});
