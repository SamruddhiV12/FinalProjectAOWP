# 🚀 Quick Start Guide

## Login Credentials

### 👨‍🎓 Student Account
```
Email: test@sda.com
Password: password123
```
After login → redirected to Student Dashboard

### 👨‍🏫 Admin Account
```
Email: admin@sda.com
Password: admin123
```
After login → redirected to Admin Dashboard

---

## How to Start the Application

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
Should see: ✅ MongoDB Connected & 🚀 Server running on port 5000

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```
Should open: http://localhost:3000

---

## Test the System

### Test Admin Login:
1. Go to http://localhost:3000/login
2. Enter:
   - Email: `admin@sda.com`
   - Password: `admin123`
3. ✅ Should see Admin Dashboard with management options

### Test Student Login:
1. Go to http://localhost:3000/login
2. Enter:
   - Email: `test@sda.com`
   - Password: `password123`
3. ✅ Should see Student Dashboard with assignments

### Test New Student Signup:
1. Go to http://localhost:3000/signup
2. Fill in all 4 steps
3. Complete registration
4. ✅ Automatically logged in as student

---

## What Was Fixed

✅ **Created admin account** - admin@sda.com with password admin123
✅ **Removed role selector** from login form (backend determines role)
✅ **Updated login page** with both student and admin credentials
✅ **Created helper scripts**:
   - `create-admin.js` - Create new admin accounts
   - `verify-admin.js` - Check existing admin accounts

---

## Important Notes

### ✅ Correct Setup:
- **Students CAN sign up** through the registration form
- **Admins CANNOT sign up** (security feature)
- **Admins are created manually** using the create-admin.js script
- **Login automatically detects role** from database
- **Routing is role-based** (students see student dashboard, admins see admin dashboard)

### 🔒 Security:
- All passwords are bcrypt hashed (10 salt rounds)
- JWT tokens expire in 7 days
- Role verification on every protected route
- Admin accounts require manual creation (can't self-register)

---

## Need More Help?

📖 Read [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md) for detailed information about:
- How authentication works
- Creating additional admin accounts
- Password security
- Troubleshooting

📖 Read [PROJECT_REPORT.md](PROJECT_REPORT.md) for complete project documentation

---

## Quick Commands

```bash
# Create a new admin account
cd backend
node create-admin.js

# Verify admin accounts exist
cd backend
node verify-admin.js

# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm start
```

---

**You're all set! Try logging in as admin now.** 🎉
