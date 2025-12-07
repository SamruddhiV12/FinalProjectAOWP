# 📊 How to View Your MongoDB Database Data

## 🎯 You have 3 options to view your database:

---

## **Option 1: MongoDB Atlas Web UI** (Easiest - Recommended)

This is the simplest way to view and manage your data directly in your browser.

### Steps:

1. **Go to MongoDB Atlas**
   - Visit: https://cloud.mongodb.com/
   - Log in with your credentials

2. **Navigate to Your Cluster**
   - Click on "Database" in the left sidebar
   - You'll see your cluster (the one you created)

3. **Browse Collections**
   - Click the **"Browse Collections"** button on your cluster
   - You'll see your database: **`sda-database`**

4. **View Your Data**
   - Click on **`sda-database`** to expand it
   - You'll see a collection called **`users`**
   - Click on **`users`** to see all registered users

5. **What You'll See**
   ```
   Collection: users

   Document 1:
   {
     "_id": "6920ed13a4f7bae88215962f",
     "firstName": "Test",
     "lastName": "Student",
     "email": "test@sda.com",
     "phone": "9876543210",
     "role": "student",
     "dateOfBirth": "2005-01-15T00:00:00.000Z",
     "gender": "Female",
     "address": {
       "street": "123 Dance Street",
       "city": "Mumbai",
       "state": "Maharashtra",
       "pincode": "400001"
     },
     "emergencyContact": {
       "name": "Parent Name",
       "phone": "9876543211",
       "relation": "Mother"
     },
     "danceInfo": {
       "hasPriorExperience": false,
       "yearsOfExperience": 0,
       "previousInstitution": "",
       "preferredBatch": "intermediate",
       "currentBatch": "intermediate",
       "enrollmentDate": "2025-11-21T22:52:03.476Z"
     },
     "isActive": true,
     "isEmailVerified": false,
     "createdAt": "2025-11-21T22:52:03.486Z",
     "updatedAt": "2025-11-21T22:52:03.486Z"
   }
   ```

6. **Features Available**:
   - ✅ **Search** - Search for specific users
   - ✅ **Filter** - Filter by any field
   - ✅ **Edit** - Manually edit documents
   - ✅ **Delete** - Delete documents
   - ✅ **Insert** - Add new documents manually
   - ✅ **Export** - Download data as JSON/CSV

---

## **Option 2: MongoDB Compass** (Desktop App - Best for Development)

MongoDB Compass is a free GUI tool for exploring and interacting with your MongoDB data.

### Steps:

1. **Download MongoDB Compass**
   - Visit: https://www.mongodb.com/try/download/compass
   - Download the FREE version for your OS (Mac/Windows/Linux)
   - Install it

2. **Get Your Connection String**
   - Open your `.env` file in the `backend` folder
   - Copy the `MONGODB_URI` value:
     ```
     mongodb+srv://sdaadmin:Mongodb%401204@sda.cyvf1xl.mongodb.net/sda-database?retryWrites=true&w=majority&appName=sda
     ```

3. **Connect to MongoDB**
   - Open MongoDB Compass
   - Paste your connection string in the "New Connection" field
   - Click "Connect"

4. **Browse Your Database**
   - On the left sidebar, you'll see: **`sda-database`**
   - Click to expand it
   - You'll see collections: **`users`** (and more as you add features)
   - Click **`users`** to view all documents

5. **Explore Features**:
   - 📊 **Visual Schema** - See data structure
   - 🔍 **Query Builder** - Build queries visually
   - 📈 **Explain Plans** - Analyze query performance
   - 📝 **CRUD Operations** - Create, Read, Update, Delete
   - 📥 **Import/Export** - Import/export data

---

## **Option 3: Command Line (For Developers)**

Use the `mongosh` (MongoDB Shell) for quick command-line access.

### Steps:

1. **Install MongoDB Shell**
   ```bash
   brew install mongosh  # On Mac
   # Or download from: https://www.mongodb.com/try/download/shell
   ```

2. **Connect to Your Database**
   ```bash
   mongosh "mongodb+srv://sdaadmin:Mongodb@1204@sda.cyvf1xl.mongodb.net/sda-database"
   ```

3. **Query Your Data**
   ```javascript
   // Show all databases
   show dbs

   // Switch to your database
   use sda-database

   // Show all collections
   show collections

   // View all users
   db.users.find().pretty()

   // Count total users
   db.users.countDocuments()

   // Find a specific user
   db.users.findOne({ email: "test@sda.com" })

   // Find all students
   db.users.find({ role: "student" })

   // Find by batch
   db.users.find({ "danceInfo.currentBatch": "intermediate" })
   ```

---

## 🔍 **Quick Checks After Signup/Login**

### 1. **Verify User Was Created** (MongoDB Atlas):
1. Go to Atlas → Browse Collections
2. Click on `sda-database` → `users`
3. You should see your test user:
   - Email: test@sda.com
   - First Name: Test
   - Last Name: Student

### 2. **Check User Data Structure**:
Every user document should have:
- ✅ Personal info (firstName, lastName, email, phone, DOB, gender)
- ✅ Hashed password (you won't see plaintext password!)
- ✅ Address (street, city, state, pincode)
- ✅ Emergency contact
- ✅ Dance info (batch, experience)
- ✅ Role (student/admin/teacher)
- ✅ Timestamps (createdAt, updatedAt)

### 3. **Verify Password is Hashed**:
The `password` field should look like:
```
"password": "$2a$10$abcd1234efgh5678..." // Encrypted!
```
NOT like:
```
"password": "password123" // ❌ Bad!
```

---

## 📊 **Useful MongoDB Atlas Features**

### **1. Search Tab**
- Search by any field
- Example: Search for email "test@sda.com"

### **2. Filters**
Click "Filter" and use MongoDB query syntax:
```json
// Find all intermediate students
{ "danceInfo.currentBatch": "intermediate" }

// Find active users
{ "isActive": true }

// Find users created today
{ "createdAt": { "$gte": new Date("2025-11-21") } }
```

### **3. Indexes**
- Click "Indexes" tab
- See what indexes exist
- Create new indexes for better performance

### **4. Schema Analysis**
- Click "Schema" tab
- See visual representation of your data structure
- Identify data types and patterns

### **5. Aggregation Pipeline**
- Click "Aggregation" tab
- Build complex queries visually
- Export as code

---

## 🎯 **What You Should See Right Now**

After running the backend and creating the test user, you should have:

**Database:** `sda-database`
**Collections:**
- `users` (1 document - the test user we created)

**User Document:**
```json
{
  "_id": ObjectId("..."),
  "firstName": "Test",
  "lastName": "Student",
  "email": "test@sda.com",
  "password": "$2a$10$..." // Hashed
  "phone": "9876543210",
  "role": "student",
  "address": { ... },
  "emergencyContact": { ... },
  "danceInfo": {
    "currentBatch": "intermediate",
    ...
  },
  "createdAt": ISODate("2025-11-21T..."),
  "updatedAt": ISODate("2025-11-21T...")
}
```

---

## 🚀 **Quick Commands Cheat Sheet**

### MongoDB Atlas Web UI:
```
1. cloud.mongodb.com → Login
2. Database → Browse Collections
3. Click sda-database → users
4. View, edit, or delete documents
```

### MongoDB Compass:
```
1. Open Compass
2. Paste connection string
3. Navigate: sda-database → users
4. Browse documents
```

### MongoDB Shell (mongosh):
```bash
# Connect
mongosh "your-connection-string"

# Common commands
use sda-database
show collections
db.users.find()
db.users.countDocuments()
```

---

## 📸 **Screenshots to Look For**

### In MongoDB Atlas:
1. **Databases Tab** → Shows "sda-database"
2. **Collections Tab** → Shows "users"
3. **Documents View** → Shows your user data in JSON format
4. **Metrics** → Shows database size, connections, operations

---

## 💡 **Pro Tips**

1. **Use Atlas for quick viewing** - Fastest for casual browsing
2. **Use Compass for development** - Best for complex queries and schema design
3. **Use mongosh for automation** - Best for scripts and quick checks

4. **Set up Alerts** (in Atlas):
   - Get notified when storage hits 75%
   - Monitor unusual activity
   - Track query performance

5. **Create Backups** (in Atlas):
   - Atlas does automatic backups
   - View under "Backup" tab
   - Can restore to any point in time

---

## 🆘 **Troubleshooting**

### Can't see data in Atlas?
- Make sure you're looking at the right cluster
- Check that you selected `sda-database` (not another DB)
- Refresh the page

### Connection fails in Compass?
- Check your internet connection
- Verify the connection string has the correct password
- Ensure IP is whitelisted in Atlas (Network Access)

### No `users` collection?
- Run signup once from the frontend
- The collection is created automatically when first user signs up

---

## ✅ **Summary**

**Easiest Method:** MongoDB Atlas Web UI (just click Browse Collections)
**Best for Development:** MongoDB Compass (downloadable GUI)
**For Quick Checks:** mongosh (command line)

Your database is at:
- **URL:** `sda.cyvf1xl.mongodb.net`
- **Database Name:** `sda-database`
- **Collection:** `users`

**Go check it now!** 🎉
