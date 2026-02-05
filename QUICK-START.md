# 🎯 QUICK START GUIDE - For Complete Beginners

## Step-by-Step Setup (10 minutes)

### ✅ Step 1: Install Required Software (5 minutes)

1. **Install Node.js**
   - Go to: https://nodejs.org/
   - Download LTS version (recommended)
   - Run installer and follow instructions
   - Verify installation: Open terminal and type `node -v`

2. **Install MongoDB**
   
   **Option A: Local Installation**
   - Go to: https://www.mongodb.com/try/download/community
   - Download and install
   - Start MongoDB service
   
   **Option B: Cloud (Easier for Beginners)** ⭐ RECOMMENDED
   - Go to: https://www.mongodb.com/cloud/atlas
   - Create FREE account
   - Click "Build a Database" → Choose FREE tier
   - Create cluster (takes 3-5 minutes)
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Save this string - you'll need it!

3. **Install VS Code**
   - Go to: https://code.visualstudio.com/
   - Download and install

4. **Install Postman (for testing)**
   - Go to: https://www.postman.com/downloads/
   - Download and install

### ✅ Step 2: Open Project in VS Code (1 minute)

1. Open VS Code
2. Click File → Open Folder
3. Select the `smart-expense-tracker` folder
4. Click "Select Folder"

### ✅ Step 3: Install Dependencies (2 minutes)

1. Open Terminal in VS Code (View → Terminal)
2. Run these commands one by one:

```bash
cd user-service
npm install
cd ..

cd expense-service
npm install
cd ..

cd budget-service
npm install
cd ..

cd analytics-service
npm install
cd ..

cd notification-service
npm install
cd ..

cd api-gateway
npm install
cd ..
```

**OR** run the setup script:
```bash
# For Mac/Linux
chmod +x setup.sh
./setup.sh

# For Windows
# Just run the commands above manually
```

### ✅ Step 4: Configure MongoDB (1 minute)

**If using MongoDB Atlas (Cloud):**

Create a file named `.env` in EACH service folder with:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker
JWT_SECRET=my_secret_key_12345
```

Replace the MongoDB URI with YOUR connection string from Atlas.

**If using Local MongoDB:**

The default connection will work! No configuration needed.

### ✅ Step 5: Start All Services (1 minute)

Open **6 SEPARATE TERMINALS** in VS Code:

**Terminal 1:**
```bash
cd user-service
npm start
```

**Terminal 2:**
```bash
cd expense-service
npm start
```

**Terminal 3:**
```bash
cd budget-service
npm start
```

**Terminal 4:**
```bash
cd analytics-service
npm start
```

**Terminal 5:**
```bash
cd notification-service
npm start
```

**Terminal 6:**
```bash
cd api-gateway
npm start
```

### ✅ Step 6: Test Your API! (5 minutes)

#### Method 1: Using Postman (Recommended)

1. Open Postman
2. Click Import
3. Select `Postman-Collection.json` from project folder
4. You'll see all API endpoints organized!

**Test Flow:**
1. Click "Register User" → Send
2. Copy the `user_id` from response
3. Update the `user_id` variable in Postman
4. Try other endpoints!

#### Method 2: Using cURL (Command Line)

**1. Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**2. Create an expense:**
```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "user-id: YOUR_USER_ID_HERE" \
  -d '{
    "amount": 50,
    "category": "Food",
    "description": "Lunch"
  }'
```

**3. Get analytics:**
```bash
curl -X GET http://localhost:3000/api/analytics/monthly-summary \
  -H "user-id: YOUR_USER_ID_HERE"
```

## 🎉 Success! You're Running a Microservices Application!

You should see:
- ✅ All 6 services running in separate terminals
- ✅ MongoDB connected messages
- ✅ API Gateway showing the welcome message

## 🔍 Testing the Unique Features

### Test Budget Alerts:

1. **Create a budget:**
```bash
POST http://localhost:3000/api/budgets
user-id: YOUR_USER_ID

{
  "category": "Food",
  "amount": 100,
  "period": "monthly",
  "alertThreshold": 80
}
```

2. **Add expenses to trigger alert:**
```bash
# Add first expense (50% of budget)
POST http://localhost:3000/api/expenses
{
  "amount": 50,
  "category": "Food",
  "description": "Groceries"
}

# Add second expense (85% of budget - ALERT TRIGGERED!)
POST http://localhost:3000/api/expenses
{
  "amount": 35,
  "category": "Food",
  "description": "Restaurant"
}
```

3. **Check your notifications:**
```bash
GET http://localhost:3000/api/notifications
```

You'll see a budget alert! 🎯

### Test Analytics:

```bash
# Get spending insights
GET http://localhost:3000/api/analytics/insights
user-id: YOUR_USER_ID

# View spending trends
GET http://localhost:3000/api/analytics/trends
user-id: YOUR_USER_ID
```

## 🐛 Common Issues & Solutions

### Issue 1: "Port already in use"
**Solution:**
```bash
# Kill the process using the port
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue 2: "MongoDB connection failed"
**Solution:**
- Check if MongoDB is running
- Verify your connection string in .env file
- For Atlas: Check if your IP is whitelisted

### Issue 3: "Cannot find module"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Services not communicating
**Solution:**
- Make sure ALL 6 services are running
- Check if ports are correct (3000-3005)
- Restart all services

## 📚 Next Steps

1. **Explore the APIs** - Try all endpoints in Postman
2. **Create Test Data** - Add expenses, budgets, and see analytics
3. **Customize** - Modify the code to add your own features
4. **Deploy** - Learn to deploy on Heroku/AWS
5. **Add Frontend** - Build a React dashboard

## 💡 Tips for CV/Interview

When discussing this project:

1. **Explain the Architecture:**
   "I built a microservices-based expense tracker with 5 independent services communicating through an API Gateway..."

2. **Highlight Unique Features:**
   "The budget monitoring service sends real-time alerts when users exceed 80% of their budget..."

3. **Discuss Technical Decisions:**
   "I chose MongoDB for its flexibility with JSON-like documents, perfect for expense data..."

4. **Show Understanding:**
   "Each service has its own database following microservices principles for better scalability..."

## 🎯 What Makes This Project Stand Out

✨ **5 Microservices** - Shows architectural understanding
✨ **Real-time Alerts** - Demonstrates event-driven design
✨ **Analytics Engine** - Shows data processing skills
✨ **Proper API Design** - RESTful with proper status codes
✨ **Production Patterns** - JWT auth, error handling, logging

## 🚀 You're Ready!

You now have a professional microservices project running locally!

**Next:** Test all the APIs, understand the code flow, and prepare to explain it in interviews!

Good luck! 💪
