# 🚀 Backend Setup - Complete Guide

## ✅ What's Already Done

I've created a complete backend with:
- ✅ Node.js + Express server
- ✅ MongoDB connection setup
- ✅ User authentication (Signup & Login)
- ✅ JWT token generation
- ✅ Password hashing with bcrypt
- ✅ Protected routes middleware
- ✅ All dependencies installed

---

## 📁 Backend Structure Created

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   └── authController.js        # Signup, Login, Profile logic
├── middleware/
│   └── auth.js                  # JWT authentication
├── models/
│   └── User.js                  # User schema (complete!)
├── routes/
│   └── auth.js                  # Auth API routes
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore
├── package.json                 # Dependencies (installed ✅)
├── server.js                    # Main server file
└── README.md                    # Detailed documentation
```

---

## 🎯 Next Steps (YOU NEED TO DO)

### Step 1: Set Up MongoDB Atlas (5 minutes)

#### 1.1 Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (it's FREE!)
3. Verify your email

#### 1.2 Create a Cluster
1. Click "Build a Database"
2. Choose **FREE M0** tier
3. Choose a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Click "Create Cluster" (takes 1-3 minutes)

#### 1.3 Create Database User
1. Click "Database Access" (left sidebar)
2. Click "+ ADD NEW DATABASE USER"
3. Choose "Password" authentication
4. Username: `sdaadmin` (or anything you want)
5. Password: Click "Autogenerate Secure Password" (SAVE THIS!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

#### 1.4 Whitelist IP Address
1. Click "Network Access" (left sidebar)
2. Click "+ ADD IP ADDRESS"
3. Click "ALLOW ACCESS FROM ANYWHERE" (for development)
4. Click "Confirm"

#### 1.5 Get Connection String
1. Click "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Copy the connection string

   It looks like:
   ```
   mongodb+srv://sdaadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### Step 2: Configure Environment Variables

1. In the `backend` folder, create a file named `.env`:
   ```bash
   cd backend
   touch .env
   ```

2. Open `.env` and paste this (UPDATE the MongoDB URI):
   ```env
   PORT=5000
   NODE_ENV=development

   # REPLACE WITH YOUR MONGODB CONNECTION STRING
   # Replace <password> with your actual password
   # Add /sda-database before the ?
   MONGODB_URI=mongodb+srv://sdaadmin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/sda-database?retryWrites=true&w=majority

   # JWT Secret (keep this secret!)
   JWT_SECRET=sda_dance_academy_super_secret_jwt_key_12345_change_in_production

   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

**IMPORTANT**:
- Replace `YOUR_PASSWORD_HERE` with the password you saved
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Add `/sda-database` after `.net` and before the `?`

---

### Step 3: Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
📊 Database Name: sda-database
🚀 Server running on port 5000
📍 Environment: development
🌐 API URL: http://localhost:5000
🔗 Frontend URL: http://localhost:3000
```

🎉 **If you see this, your backend is running!**

---

## 🧪 Step 4: Test the API

### Option A: Using Thunder Client (VS Code Extension)

1. Install "Thunder Client" extension in VS Code
2. Create a new request
3. Test Signup:
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/signup`
   - Body (JSON):
   ```json
   {
     "firstName": "Test",
     "lastName": "Student",
     "email": "test@sda.com",
     "password": "password123",
     "phone": "9876543210",
     "dateOfBirth": "2005-01-15",
     "gender": "Female",
     "address": "123 Dance Street",
     "city": "Mumbai",
     "state": "Maharashtra",
     "pincode": "400001",
     "emergencyContactName": "Parent Name",
     "emergencyContactPhone": "9876543211",
     "emergencyContactRelation": "Mother",
     "preferredBatch": "intermediate"
   }
   ```

4. Click "Send"
5. You should get a response with `"success": true` and a `token`

6. Test Login:
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/login`
   - Body (JSON):
   ```json
   {
     "email": "test@sda.com",
     "password": "password123"
   }
   ```

### Option B: Using curl (Terminal)

```bash
# Test Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Student",
    "email": "test@sda.com",
    "password": "password123",
    "phone": "9876543210",
    "dateOfBirth": "2005-01-15",
    "gender": "Female",
    "address": "123 Dance Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "emergencyContactName": "Parent Name",
    "emergencyContactPhone": "9876543211",
    "emergencyContactRelation": "Mother",
    "preferredBatch": "intermediate"
  }'

# Test Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@sda.com",
    "password": "password123"
  }'
```

---

## 📋 API Endpoints Available

### Public (No Authentication Required)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Protected (Requires JWT Token)
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/update-password` - Change password

---

## 🔐 How JWT Authentication Works

1. User signs up or logs in
2. Server generates a JWT token
3. Frontend stores the token (localStorage)
4. Frontend sends token with each request in headers:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Backend verifies token and allows access

---

## 🚨 Common Errors & Solutions

### Error: "MongoDB connection failed"
**Solution**:
- Check your internet connection
- Verify `.env` file has correct MongoDB URI
- Ensure IP is whitelisted in MongoDB Atlas
- Check password is correct (no special characters causing issues)

### Error: "Port 5000 already in use"
**Solution**:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env to 5001
```

### Error: "JWT_SECRET is not defined"
**Solution**:
- Make sure `.env` file exists in `backend/` folder
- Restart the server after creating `.env`

### Error: "User validation failed"
**Solution**:
- Check all required fields are provided in signup
- Phone must be 10 digits
- Pincode must be 6 digits
- Email must be valid format

---

## 🎯 What's Next?

Once backend is working:

### Phase 1: Connect Frontend (Next Task)
- Update frontend Signup component to call API
- Update frontend Login component to call API
- Store JWT token in localStorage
- Add token to all protected requests

### Phase 2: Build More Features
- Assignments API
- Classes API
- Attendance API
- Payments API
- Progress Reports API
- Study Materials API

### Phase 3: File Uploads
- Profile picture upload
- Assignment video submissions
- Study material PDFs

---

## 📊 Database Schema (User Model)

The User model includes ALL the fields from your signup form:

```javascript
{
  // Personal Info
  firstName, lastName, email, password (hashed)
  phone, dateOfBirth, gender

  // Role
  role: 'student' | 'admin' | 'teacher'

  // Address
  address: { street, city, state, pincode }

  // Emergency Contact
  emergencyContact: { name, phone, relation }

  // Dance Info
  danceInfo: {
    hasPriorExperience, yearsOfExperience,
    previousInstitution, preferredBatch,
    currentBatch, enrollmentDate
  }

  // Profile
  profilePicture, isActive, isEmailVerified

  // Notifications
  notifications: { email, sms, pushNotifications }

  // Stats
  stats: { attendance, assignmentsCompleted, averageScore }

  // Timestamps
  createdAt, updatedAt
}
```

---

## ✅ Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created database cluster
- [ ] Created database user
- [ ] Whitelisted IP address
- [ ] Got connection string
- [ ] Created `.env` file with MongoDB URI
- [ ] Started backend server (`npm run dev`)
- [ ] Tested signup endpoint
- [ ] Tested login endpoint
- [ ] Ready to connect frontend!

---

## 🆘 Need Help?

If stuck:
1. Check backend terminal for error messages
2. Verify MongoDB Atlas setup
3. Ensure `.env` file is correct
4. Try restarting the server

---

**Ready to connect the frontend?** Let me know once the backend is running! 🚀
