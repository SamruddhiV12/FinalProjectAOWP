#  Samruddhi's Dance Academy - Backend API

Backend API for the Dance Academy Management System built with Node.js, Express, and MongoDB.

---

##  Quick Start Guide

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Set Up MongoDB Atlas (FREE Cloud Database)

#### 2.1 Create MongoDB Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a FREE account
3. Create a new cluster (choose FREE M0 tier)

#### 2.2 Create Database User
1. In your Atlas dashboard, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username and password (save these!)
5. Set privileges to **"Read and write to any database"**
6. Click **"Add User"**

#### 2.3 Whitelist Your IP
1. Click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

#### 2.4 Get Connection String
1. Click **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`

### Step 3: Configure Environment Variables

1. Copy the example env file:
```bash
cp .env.example .env
```

2. Open `.env` file and update:
```env
PORT=5000
NODE_ENV=development

# Replace with your MongoDB connection string
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/sda-database?retryWrites=true&w=majority

# Generate a random secret (or use this one for testing)
JWT_SECRET=your_super_secret_jwt_key_change_this_12345

JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Important**:
- Replace `<password>` with your actual password
- Replace `<dbname>` with `sda-database` (or any name you want)
- Never commit `.env` file to git!

### Step 4: Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
 MongoDB Connected: cluster0.xxxxx.mongodb.net
 Database Name: sda-database
 Server running on port 5000
📍 Environment: development
 API URL: http://localhost:5000
🔗 Frontend URL: http://localhost:3000
```

---

##  API Endpoints

### Authentication Routes

#### 1. **Signup (Register New User)**
- **URL**: `POST http://localhost:5000/api/auth/signup`
- **Body** (JSON):
```json
{
  "firstName": "Priya",
  "lastName": "Sharma",
  "email": "priya@example.com",
  "password": "password123",
  "phone": "9876543210",
  "dateOfBirth": "2005-03-15",
  "gender": "Female",
  "address": "123 Dance Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "emergencyContactName": "Rajesh Sharma",
  "emergencyContactPhone": "9876543211",
  "emergencyContactRelation": "Father",
  "preferredBatch": "intermediate"
}
```

- **Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "firstName": "Priya",
    "lastName": "Sharma",
    "email": "priya@example.com",
    "role": "student",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. **Login**
- **URL**: `POST http://localhost:5000/api/auth/login`
- **Body** (JSON):
```json
{
  "email": "priya@example.com",
  "password": "password123"
}
```

- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "...",
    "firstName": "Priya",
    "lastName": "Sharma",
    "email": "priya@example.com",
    "role": "student",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. **Get Current User Profile**
- **URL**: `GET http://localhost:5000/api/auth/me`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN_HERE
  ```
- **Response**: Full user profile

#### 4. **Update Profile**
- **URL**: `PUT http://localhost:5000/api/auth/update-profile`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN_HERE
  ```
- **Body**: Fields to update

#### 5. **Update Password**
- **URL**: `PUT http://localhost:5000/api/auth/update-password`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN_HERE
  ```
- **Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

---

## 🧪 Testing the API

### Option A: Using VS Code Extension (Recommended)
1. Install **"Thunder Client"** or **"REST Client"** extension
2. Create a new request
3. Test the endpoints above

### Option B: Using Postman
1. Download [Postman](https://www.postman.com/downloads/)
2. Import the endpoints
3. Test signup and login

### Option C: Using curl
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "9876543210",
    "dateOfBirth": "2000-01-01",
    "gender": "Female",
    "address": "123 Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "emergencyContactName": "Parent Name",
    "emergencyContactPhone": "9876543211",
    "emergencyContactRelation": "Parent",
    "preferredBatch": "basic"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   └── authController.js     # Auth logic (signup, login, etc.)
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   └── User.js              # User schema/model
├── routes/
│   └── auth.js              # Auth routes
├── .env                     # Environment variables (create this!)
├── .env.example             # Example env file
├── .gitignore               # Git ignore file
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # This file
```

---

## 🔐 User Schema

The User model includes:

### Personal Information:
- firstName, lastName
- email (unique)
- password (hashed)
- phone, dateOfBirth, gender

### Address:
- street, city, state, pincode

### Emergency Contact:
- name, phone, relation

### Dance Information:
- hasPriorExperience
- yearsOfExperience
- previousInstitution
- preferredBatch / currentBatch
- enrollmentDate

### Profile:
- profilePicture
- role (student/admin/teacher)
- isActive, isEmailVerified

### Notification Preferences:
- email, sms, pushNotifications

### Stats:
- attendance, assignmentsCompleted, averageScore

---

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **morgan** - HTTP request logger
- **express-validator** - Input validation

---

## 🚨 Common Issues & Solutions

### Issue 1: "MongoDB connection failed"
**Solution**:
- Check your internet connection
- Verify MongoDB URI in `.env`
- Ensure IP is whitelisted in MongoDB Atlas
- Check username/password are correct

### Issue 2: "Port 5000 already in use"
**Solution**:
- Change PORT in `.env` to 5001 or another port
- Or kill the process using port 5000:
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```

### Issue 3: "ValidationError"
**Solution**:
- Check all required fields are provided
- Verify data types match schema
- Check phone/pincode format (10 digits / 6 digits)

---

##  Next Steps

After backend is working:

1.  Test all auth endpoints
2. Create more models (Assignment, Class, Payment, etc.)
3. Build additional API endpoints
4. Connect frontend to backend
5. Add file upload for profile pictures
6. Implement email verification
7. Add password reset functionality

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the console logs for error messages
2. Verify MongoDB connection
3. Ensure all environment variables are set
4. Check if ports are available

---

## 📄 License

MIT
