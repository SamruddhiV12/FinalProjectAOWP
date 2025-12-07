# Authentication Guide - Samruddhi's Dance Academy

## Overview

The system has two types of users with different access methods:

### 👨‍🎓 Students
- **Can Sign Up:** Yes, through the multi-step registration form
- **Can Login:** Yes, after registration
- **Default Role:** `student`

### 👨‍🏫 Admins/Teachers
- **Can Sign Up:** No, admin accounts are created manually
- **Can Login:** Yes, with pre-created credentials
- **Role:** `admin` or `teacher`

---

## Login Credentials

### Student Demo Account
```
Email: test@sda.com
Password: password123
Role: student
```

### Admin Account
```
Email: admin@sda.com
Password: admin123
Role: admin
```

---

## How It Works

### For Students:

1. **New Students:**
   - Visit the Signup page
   - Complete the 4-step registration form
   - System automatically assigns role as "student"
   - After signup, can immediately login

2. **Login Process:**
   - Enter email and password
   - Backend checks credentials
   - JWT token generated
   - User redirected to Student Dashboard

### For Admins:

1. **No Public Signup:**
   - Admin accounts are NOT created through the signup page
   - Only manual creation by database administrator

2. **Login Process:**
   - Enter admin email and password
   - Backend checks credentials and role
   - JWT token generated
   - User redirected to Admin Dashboard

3. **Creating New Admin Accounts:**
   - Use the `create-admin.js` script in backend folder
   - See "Creating Additional Admin Accounts" section below

---

## Creating Additional Admin Accounts

If you need to create more admin or teacher accounts:

### Method 1: Using the Script (Recommended)

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Edit the `create-admin.js` file:**
   - Change the email (line 77)
   - Change the password (line 79)
   - Change the name (lines 75-76)
   - Optionally change role to 'teacher' (line 83)

3. **Run the script:**
   ```bash
   node create-admin.js
   ```

4. **Script will output the new credentials**

### Method 2: Direct MongoDB Insert

You can also create admin users directly in MongoDB Atlas or Compass:

1. Go to your `users` collection
2. Insert a new document with role: "admin"
3. **Important:** Password must be bcrypt hashed!

---

## Password Security

### How Passwords are Stored:

- **NOT stored as plain text** ✅
- **Bcrypt hashed** with 10 salt rounds
- **Automatic hashing** via Mongoose pre-save hook

Example:
```javascript
Plain text: admin123
Stored in DB: $2a$10$abcd1234...xyz (60+ characters)
```

### Changing Admin Password:

**Option 1: Using the API** (if logged in)
```bash
PUT /api/auth/update-password
{
  "currentPassword": "admin123",
  "newPassword": "newPassword123"
}
```

**Option 2: Recreate the admin user**
1. Delete the existing admin user from MongoDB
2. Run `create-admin.js` script again with new password

---

## Frontend Changes Made

### Login Component (`frontend/src/components/Login.jsx`)

**Before:**
- Had a role selector dropdown (Student/Admin)
- Role was not actually sent to backend
- Confusing for users

**After:**
- Removed role selector
- Backend automatically determines role from database
- Cleaner, simpler UI
- Updated demo credentials to show both student and admin

### Signup Component (`frontend/src/components/Signup.jsx`)

**No changes needed:**
- Correctly only allows student registration
- Sets role as 'student' automatically
- Admins cannot sign up through this form ✅

---

## Role-Based Access Control

### How It Works:

1. **User logs in** with email/password
2. **Backend validates** credentials
3. **Backend returns** user data including role
4. **Frontend stores** role in state and localStorage
5. **Routes protected** by role in `App.js`

### Route Protection:

```javascript
// Student Routes - Only accessible if role === 'student'
/student
/assignment/:id
/progress
/materials
/exam/:id
/payments

// Admin Routes - Only accessible if role === 'admin'
/admin
/review
/attendance
/admin/materials
/classes
```

### Automatic Redirection:

- After login, users are automatically redirected based on role:
  - Students → `/student` (Student Dashboard)
  - Admins → `/admin` (Admin Dashboard)

---

## Testing Authentication

### Test Student Login:
1. Make sure backend is running: `cd backend && npm run dev`
2. Make sure frontend is running: `cd frontend && npm start`
3. Go to `http://localhost:3000/login`
4. Enter:
   - Email: `test@sda.com`
   - Password: `password123`
5. Should redirect to Student Dashboard

### Test Admin Login:
1. Go to `http://localhost:3000/login`
2. Enter:
   - Email: `admin@sda.com`
   - Password: `admin123`
3. Should redirect to Admin Dashboard

### Test New Student Signup:
1. Go to `http://localhost:3000/signup`
2. Complete all 4 steps
3. Click "Complete Registration"
4. Should automatically log in and redirect to Student Dashboard

---

## Troubleshooting

### "Invalid credentials" error:

**Check:**
- Email is spelled correctly (case-insensitive)
- Password is correct (case-sensitive)
- Backend server is running
- MongoDB is connected

**Verify admin exists in database:**
```bash
# In MongoDB Compass or Atlas
Collection: users
Filter: { "email": "admin@sda.com" }
```

### "Account has been deactivated" error:

**Fix:**
- Update the user document in MongoDB
- Set `isActive: true`

### Admin can't access admin routes:

**Check:**
- User role in database is "admin" (not "Admin" or "administrator")
- JWT token has correct role claim
- Clear browser localStorage and login again

### Forgot admin password:

**Solution:**
1. Delete admin user from MongoDB
2. Run `create-admin.js` again

---

## Security Best Practices

### For Production:

1. **Change default passwords:**
   ```bash
   # Don't use admin123 in production!
   # Use strong passwords: uppercase, lowercase, numbers, symbols
   ```

2. **Use environment variables:**
   ```bash
   # In .env file
   ADMIN_EMAIL=your-secure-email@domain.com
   ADMIN_PASSWORD=your-very-strong-password
   ```

3. **Limit admin accounts:**
   - Create only necessary admin accounts
   - Review and remove inactive admins

4. **Enable email verification:**
   - Set `isEmailVerified: true` only after verification
   - Implement email verification flow

5. **Add rate limiting:**
   - Prevent brute force attacks
   - Limit login attempts

6. **Use HTTPS in production:**
   - Encrypt data in transit
   - Secure JWT tokens

---

## Files Modified/Created

### Created:
- ✅ `backend/create-admin.js` - Script to create admin users
- ✅ `AUTHENTICATION_GUIDE.md` - This documentation

### Modified:
- ✅ `frontend/src/components/Login.jsx` - Removed role selector, added admin credentials

### No Changes Needed:
- ✅ `frontend/src/components/Signup.jsx` - Already correct (student only)
- ✅ `backend/controllers/authController.js` - Already handles roles correctly
- ✅ `backend/models/User.js` - Already has role field
- ✅ `frontend/src/App.js` - Already has role-based routing

---

## Summary

✅ **Students can sign up** - 4-step registration form
✅ **Admins cannot sign up** - Security feature
✅ **Admin account created** - admin@sda.com / admin123
✅ **Login works for both** - Automatically detects role
✅ **Role-based routing** - Students and admins see different dashboards
✅ **Secure passwords** - Bcrypt hashing
✅ **Clean UI** - Removed confusing role selector

**You're all set!** 🎉

Try logging in as admin now:
- Email: `admin@sda.com`
- Password: `admin123`
