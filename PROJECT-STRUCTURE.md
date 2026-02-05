# 📂 PROJECT STRUCTURE EXPLAINED

## Complete File Structure

```
smart-expense-tracker/
│
├── 📁 user-service/                    # Service 1: User Management
│   ├── server.js                       # Main server file with routes
│   ├── package.json                    # Dependencies list
│   └── .env                           # Environment variables (create this)
│
├── 📁 expense-service/                 # Service 2: Expense Tracking
│   ├── server.js                       # Expense CRUD operations
│   ├── package.json                    
│   └── .env
│
├── 📁 budget-service/                  # Service 3: Budget Management ⭐
│   ├── server.js                       # Budget monitoring & alerts
│   ├── package.json
│   └── .env
│
├── 📁 analytics-service/               # Service 4: Data Analytics
│   ├── server.js                       # Insights & reports generation
│   ├── package.json
│   └── .env
│
├── 📁 notification-service/            # Service 5: Notifications
│   ├── server.js                       # Alert delivery system
│   ├── package.json
│   └── .env
│
├── 📁 api-gateway/                     # Gateway: Request Router
│   ├── server.js                       # Routes to all services
│   └── package.json
│
├── 📄 README.md                        # Complete documentation
├── 📄 QUICK-START.md                   # Beginner's guide
├── 📄 Postman-Collection.json          # API testing collection
└── 📄 setup.sh                         # Auto-setup script
```

## Understanding Each File

### 1. server.js Files

Each `server.js` contains:

```javascript
// 1. IMPORTS - Required modules
const express = require('express');      // Web framework
const mongoose = require('mongoose');    // Database connector
const cors = require('cors');           // Allow cross-origin requests

// 2. SETUP
const app = express();                  // Create app
app.use(express.json());               // Parse JSON
app.use(cors());                       // Enable CORS

// 3. DATABASE SCHEMA
const schema = new mongoose.Schema({
  // Define data structure
});

// 4. ROUTES/ENDPOINTS
app.post('/api/something', (req, res) => {
  // Handle POST requests
});

app.get('/api/something', (req, res) => {
  // Handle GET requests
});

// 5. START SERVER
app.listen(PORT, () => {
  console.log('Service running...');
});
```

### 2. package.json Files

Lists all dependencies:

```json
{
  "name": "service-name",
  "version": "1.0.0",
  "dependencies": {
    "express": "Web framework",
    "mongoose": "MongoDB driver",
    "cors": "Cross-origin support",
    "axios": "HTTP client"
  }
}
```

### 3. .env Files (You Create These)

Environment variables for each service:

```env
MONGO_URI=mongodb://localhost:27017/database_name
JWT_SECRET=your_secret_key
PORT=3001
```

## How Services Work Together

### Data Flow Example: Creating an Expense

```
1. User sends request to API Gateway (Port 3000)
   ↓
2. Gateway routes to Expense Service (Port 3002)
   ↓
3. Expense Service saves to MongoDB
   ↓
4. Expense Service calls Budget Service (Port 3003)
   ↓
5. Budget Service checks if budget exceeded
   ↓
6. Budget Service calls Notification Service (Port 3005)
   ↓
7. Notification Service sends alert to user
   ↓
8. Response travels back to user
```

## Code Patterns Used

### 1. Express Route Pattern

```javascript
// CREATE - POST
app.post('/api/resource', async (req, res) => {
  try {
    const data = req.body;
    const result = await Model.create(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - GET
app.get('/api/resource', async (req, res) => {
  const items = await Model.find({ userId: req.userId });
  res.json(items);
});

// UPDATE - PUT
app.put('/api/resource/:id', async (req, res) => {
  const updated = await Model.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE - DELETE
app.delete('/api/resource/:id', async (req, res) => {
  await Model.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
```

### 2. MongoDB Schema Pattern

```javascript
const schema = new mongoose.Schema({
  // Field definitions
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Other'],  // Only these values allowed
    default: 'Other'
  },
  createdAt: { type: Date, default: Date.now }
});

const Model = mongoose.model('ModelName', schema);
```

### 3. Service-to-Service Communication

```javascript
// One service calling another
try {
  const response = await axios.post('http://localhost:3003/api/endpoint', {
    data: 'to send'
  });
  console.log('Service responded:', response.data);
} catch (error) {
  console.log('Service call failed (non-critical)');
}
```

### 4. Authentication Middleware

```javascript
const authenticateUser = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.userId = userId;
  next();  // Continue to route handler
};

// Use it in routes
app.get('/api/protected', authenticateUser, (req, res) => {
  // Can access req.userId here
});
```

## Database Structure

### User Service Database: `expense_users`
```
Collection: users
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  profile: {
    firstName: String,
    lastName: String,
    currency: String,
    monthlyIncome: Number
  },
  createdAt: Date
}
```

### Expense Service Database: `expense_tracker`
```
Collection: expenses
{
  _id: ObjectId,
  userId: String,
  amount: Number,
  category: String,
  description: String,
  date: Date,
  paymentMethod: String,
  tags: [String]
}
```

### Budget Service Database: `expense_budgets`
```
Collection: budgets
{
  _id: ObjectId,
  userId: String,
  category: String,
  amount: Number,
  spent: Number,
  period: String,
  alertThreshold: Number,
  startDate: Date,
  endDate: Date
}

Collection: budgetalerts
{
  _id: ObjectId,
  userId: String,
  budgetId: ObjectId,
  message: String,
  severity: String,
  isRead: Boolean
}
```

### Notification Service Database: `expense_notifications`
```
Collection: notifications
{
  _id: ObjectId,
  userId: String,
  type: String,
  message: String,
  priority: String,
  isRead: Boolean,
  createdAt: Date
}
```

## API Endpoints Map

### User Service (3001)
```
POST   /api/auth/register     → Register new user
POST   /api/auth/login        → Login user
GET    /api/users/profile     → Get profile
PUT    /api/users/profile     → Update profile
```

### Expense Service (3002)
```
POST   /api/expenses          → Create expense
GET    /api/expenses          → Get all expenses
GET    /api/expenses/:id      → Get one expense
PUT    /api/expenses/:id      → Update expense
DELETE /api/expenses/:id      → Delete expense
GET    /api/expenses/summary/by-category → Category summary
```

### Budget Service (3003)
```
POST   /api/budgets           → Create budget
GET    /api/budgets           → Get all budgets
PUT    /api/budgets/:id       → Update budget
DELETE /api/budgets/:id       → Delete budget
POST   /api/budgets/check     → Check budget (internal)
GET    /api/budgets/alerts    → Get alerts
```

### Analytics Service (3004)
```
GET    /api/analytics/monthly-summary   → Month summary
GET    /api/analytics/trends            → 6-month trends
GET    /api/analytics/category-analysis → Category breakdown
GET    /api/analytics/daily-pattern     → Daily spending
GET    /api/analytics/insights          → AI insights
```

### Notification Service (3005)
```
POST   /api/notifications/send         → Send notification (internal)
GET    /api/notifications              → Get notifications
PUT    /api/notifications/:id/read     → Mark as read
DELETE /api/notifications/:id          → Delete notification
GET    /api/notifications/unread-count → Count unread
```

## Understanding the Unique Features

### 1. Budget Alert System

**How it works:**
1. User sets a budget (e.g., $500 for Food)
2. User adds expense ($400 for groceries)
3. Expense Service notifies Budget Service
4. Budget Service calculates: $400/$500 = 80%
5. 80% ≥ alert threshold (80%) → ALERT!
6. Budget Service creates alert
7. Budget Service calls Notification Service
8. User gets notification

**Code location:** `budget-service/server.js` → `/api/budgets/check` endpoint

### 2. Analytics Engine

**Insights generated:**
- Highest spending category
- Weekend vs weekday patterns
- Monthly trends (6 months)
- Daily averages
- Spending predictions

**Code location:** `analytics-service/server.js` → `/api/analytics/insights` endpoint

### 3. Inter-Service Communication

**Example:** Expense → Budget → Notification

```javascript
// In Expense Service
await axios.post('http://localhost:3003/api/budgets/check', {
  userId, category, amount
});

// In Budget Service
if (budgetExceeded) {
  await axios.post('http://localhost:3005/api/notifications/send', {
    userId, message: 'Budget exceeded!'
  });
}
```

## Technologies Explained

### Express.js
- Web framework for Node.js
- Handles HTTP requests
- Creates API endpoints

### MongoDB (Mongoose)
- NoSQL database
- Stores JSON-like documents
- Flexible schema

### JWT (JSON Web Tokens)
- Secure authentication
- Stateless (no server-side sessions)
- Contains user info encoded

### CORS
- Allows frontend to call backend
- Prevents security issues
- Required for API gateways

### Axios
- HTTP client for Node.js
- Makes requests between services
- Promise-based

## Security Features

1. **Password Hashing** (bcryptjs)
   ```javascript
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **JWT Authentication**
   ```javascript
   const token = jwt.sign({ userId }, secret, { expiresIn: '7d' });
   ```

3. **Input Validation**
   ```javascript
   if (!amount || !category) {
     return res.status(400).json({ error: 'Required fields missing' });
   }
   ```

4. **Error Handling**
   ```javascript
   try {
     // Code that might fail
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
   ```

## What Happens When You Start a Service

1. **Load Dependencies**
   ```javascript
   const express = require('express');
   ```

2. **Connect to Database**
   ```javascript
   mongoose.connect(MONGO_URI)
   ```

3. **Register Routes**
   ```javascript
   app.post('/api/endpoint', handler);
   ```

4. **Start Listening**
   ```javascript
   app.listen(PORT);
   ```

5. **Ready to Accept Requests!**

## How to Modify the Project

### Add a New Expense Category

**File:** `expense-service/server.js`

Find:
```javascript
enum: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other']
```

Add your category:
```javascript
enum: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Groceries', 'Other']
```

### Add a New API Endpoint

```javascript
app.get('/api/my-new-endpoint', authenticateUser, async (req, res) => {
  try {
    // Your logic here
    const data = await Model.find({ userId: req.userId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Add a New Field to Database

```javascript
const schema = new mongoose.Schema({
  // Existing fields...
  amount: Number,
  
  // New field
  taxAmount: { type: Number, default: 0 }
});
```

## Common HTTP Status Codes Used

```
200 - OK (successful GET)
201 - Created (successful POST)
400 - Bad Request (validation error)
401 - Unauthorized (no auth)
404 - Not Found (resource doesn't exist)
409 - Conflict (duplicate data)
500 - Internal Server Error (server problem)
503 - Service Unavailable (service down)
```

## Interview Questions You Should Be Ready For

1. **Why microservices over monolithic?**
   - Independent deployment
   - Technology flexibility
   - Better scalability
   - Fault isolation

2. **How do services communicate?**
   - REST APIs (HTTP)
   - Through API Gateway
   - Direct service-to-service calls

3. **What if one service fails?**
   - Try-catch blocks
   - Non-critical failures logged
   - Gateway returns 503 error
   - Other services continue working

4. **Why API Gateway?**
   - Single entry point
   - Centralized routing
   - Load balancing potential
   - Security layer

5. **How is data consistency maintained?**
   - Each service owns its data
   - Event-driven updates
   - Eventual consistency model

## Next Learning Steps

1. ✅ **Understand the code** - Read each server.js file
2. ✅ **Run and test** - Use Postman to test all endpoints
3. ✅ **Modify** - Add your own features
4. ⬜ **Add Docker** - Containerize services
5. ⬜ **Deploy** - Put it on cloud (Heroku/AWS)
6. ⬜ **Add Frontend** - Build React dashboard
7. ⬜ **Add Tests** - Write unit tests

---

**Remember:** This is YOUR project. Understand it deeply, customize it, and be ready to explain every part in interviews!

Good luck! 🚀
