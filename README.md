# 💰 Smart Expense Tracker - Microservices Architecture

A production-ready expense tracking system built with microservices architecture, demonstrating modern software design patterns and real-world application development.

## 🌟 Project Highlights

This project showcases:
- **Microservices Architecture** with 5 independent services
- **Event-Driven Communication** between services
- **RESTful API Design** with proper HTTP methods and status codes
- **JWT Authentication** for secure user management
- **MongoDB** for scalable data persistence
- **Budget Alert System** with real-time notifications
- **Analytics & Insights** engine for spending patterns
- **API Gateway** pattern for centralized routing

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     API Gateway (3000)                   │
│              Central Entry Point for All Requests        │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ User Service │ │Expense Service│ │Budget Service│
│   (3001)     │ │    (3002)     │ │   (3003)     │
│              │ │               │ │              │
│ - Auth       │ │ - Track $     │ │ - Set Limits │
│ - Profile    │ │ - Categories  │ │ - Alerts     │
│ - JWT        │ │ - CRUD        │ │ - Monitor    │
└──────────────┘ └──────────────┘ └──────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────────────────────┐
│  Analytics   │ │    Notification Service      │
│  Service     │ │         (3005)               │
│   (3004)     │ │                              │
│              │ │  - Email/SMS/Push Alerts     │
│ - Insights   │ │  - Budget Exceeded Warnings  │
│ - Trends     │ │  - Weekly Summaries          │
│ - Reports    │ │                              │
└──────────────┘ └──────────────────────────────┘
```

## 🚀 Services Breakdown

### 1. **User Service** (Port 3001)
- User registration and authentication
- JWT token generation and validation
- User profile management
- Multi-currency support

### 2. **Expense Service** (Port 3002)
- Create, read, update, delete expenses
- Category-based organization (Food, Transport, Entertainment, etc.)
- Payment method tracking
- Date-range filtering
- Tags for better organization

### 3. **Budget Service** (Port 3003) ⭐ **Unique Feature**
- Set budgets per category (monthly/weekly/daily)
- Real-time budget monitoring
- Automatic alerts at 80% threshold
- Budget exceeded notifications
- Historical budget tracking

### 4. **Analytics Service** (Port 3004)
- Monthly spending summaries
- 6-month spending trends
- Category-wise analysis
- Daily spending patterns
- Top expenses tracking
- AI-like spending insights

### 5. **Notification Service** (Port 3005)
- Multi-channel notifications (In-app, Email, SMS, Push)
- Priority-based alerts
- Weekly spending summaries
- Budget alert integration
- Read/unread status tracking

### 6. **API Gateway** (Port 3000)
- Single entry point for all services
- Request routing
- Service health monitoring
- Error handling

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR use **MongoDB Atlas** (Cloud) - [Free Tier](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** - [Download](https://code.visualstudio.com/)
- **Postman** (for API testing) - [Download](https://www.postman.com/)

## 🔧 Installation & Setup

### Step 1: Clone or Download Project

```bash
# If you have the project folder, navigate to it
cd smart-expense-tracker
```

### Step 2: Install Dependencies for Each Service

Open 6 terminals in VS Code (Terminal → New Terminal) and run:

**Terminal 1 - User Service:**
```bash
cd user-service
npm install
```

**Terminal 2 - Expense Service:**
```bash
cd expense-service
npm install
```

**Terminal 3 - Budget Service:**
```bash
cd budget-service
npm install
```

**Terminal 4 - Analytics Service:**
```bash
cd analytics-service
npm install
```

**Terminal 5 - Notification Service:**
```bash
cd notification-service
npm install
```

**Terminal 6 - API Gateway:**
```bash
cd api-gateway
npm install
```

### Step 3: Setup MongoDB

#### Option A: Local MongoDB
1. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud - Recommended for Beginners)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Create `.env` file in each service folder with:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   JWT_SECRET=your_secret_key_here_2024
   ```

### Step 4: Start All Services

In each of the 6 terminals, run:

```bash
# In each service directory
npm start
```

You should see:
```
✅ User Service - MongoDB Connected
🚀 User Service running on port 3001

✅ Expense Service - MongoDB Connected
🚀 Expense Service running on port 3002

✅ Budget Service - MongoDB Connected
🚀 Budget Service running on port 3003

✅ Analytics Service - MongoDB Connected
🚀 Analytics Service running on port 3004

✅ Notification Service - MongoDB Connected
🚀 Notification Service running on port 3005

🚀 API Gateway Running on Port 3000
```

## 🧪 Testing the API

### Using Postman

#### 1. Register a User
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "currency": "USD"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12345",
    "username": "johndoe",
    "email": "john@example.com",
    "currency": "USD"
  }
}
```

#### 2. Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Create an Expense
```
POST http://localhost:3000/api/expenses
Content-Type: application/json
user-id: <your-user-id-from-registration>

{
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch at restaurant",
  "paymentMethod": "Credit Card",
  "tags": ["lunch", "dining"]
}
```

#### 4. Set a Budget
```
POST http://localhost:3000/api/budgets
Content-Type: application/json
user-id: <your-user-id>

{
  "category": "Food",
  "amount": 500,
  "period": "monthly",
  "alertThreshold": 80
}
```

#### 5. Get Analytics
```
GET http://localhost:3000/api/analytics/monthly-summary
user-id: <your-user-id>
```

#### 6. Get Spending Insights
```
GET http://localhost:3000/api/analytics/insights
user-id: <your-user-id>
```

## 📊 Complete API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |

### Expense Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Create expense |
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/expenses/:id` | Get specific expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/expenses/summary/by-category` | Category summary |

### Budget Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/budgets` | Create budget |
| GET | `/api/budgets` | Get all budgets |
| PUT | `/api/budgets/:id` | Update budget |
| DELETE | `/api/budgets/:id` | Delete budget |
| GET | `/api/budgets/alerts` | Get budget alerts |
| PUT | `/api/budgets/alerts/:id/read` | Mark alert as read |

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/monthly-summary` | Monthly summary |
| GET | `/api/analytics/trends` | 6-month trends |
| GET | `/api/analytics/category-analysis` | Category analysis |
| GET | `/api/analytics/daily-pattern` | Daily spending |
| GET | `/api/analytics/top-expenses` | Top expenses |
| GET | `/api/analytics/insights` | AI-like insights |

### Notification Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get all notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |
| DELETE | `/api/notifications/:id` | Delete notification |
| GET | `/api/notifications/unread-count` | Get unread count |

## 🎯 Key Features Demonstrated

### 1. Microservices Principles
- ✅ Service Independence
- ✅ Single Responsibility
- ✅ Decentralized Data Management
- ✅ API Gateway Pattern

### 2. Backend Development
- ✅ RESTful API Design
- ✅ JWT Authentication
- ✅ Database Design (MongoDB)
- ✅ Error Handling
- ✅ Input Validation

### 3. Real-World Scenarios
- ✅ Budget Monitoring
- ✅ Real-time Alerts
- ✅ Data Analytics
- ✅ Multi-service Communication

### 4. Professional Practices
- ✅ Clean Code Structure
- ✅ Environment Variables
- ✅ Proper HTTP Status Codes
- ✅ Logging
- ✅ Health Checks

## 📝 For Your CV/LinkedIn

### Project Title
**"Smart Expense Tracker - Microservices Architecture"**

### Description
```
Developed a full-stack expense tracking application using microservices architecture with 
Node.js and Express. Implemented 5 independent services including user authentication, 
expense management, budget monitoring with real-time alerts, analytics engine, and 
notification system. Designed RESTful APIs with JWT authentication, MongoDB data 
persistence, and event-driven inter-service communication through an API Gateway. 
Features include budget threshold alerts, spending pattern analysis, multi-category 
tracking, and comprehensive analytics dashboard.
```

### Technical Skills to Highlight
- **Backend**: Node.js, Express.js, RESTful APIs
- **Database**: MongoDB, Mongoose ODM
- **Architecture**: Microservices, API Gateway Pattern, Event-Driven Design
- **Authentication**: JWT (JSON Web Tokens)
- **Communication**: Inter-service HTTP requests (Axios)
- **Tools**: Postman, VS Code, Git
- **Concepts**: CRUD operations, Data Modeling, Service Orchestration

### Key Achievements
- ⭐ Designed and implemented 5 microservices with independent databases
- ⭐ Built intelligent budget alert system with 80% threshold notifications
- ⭐ Created analytics engine providing spending insights and trends
- ⭐ Implemented real-time notification system for budget monitoring
- ⭐ Developed API Gateway for centralized request routing and error handling

## 🔮 Future Enhancements (To Impress More!)

1. **Docker Containerization**
   - Containerize each service
   - Docker Compose for orchestration

2. **Cloud Deployment**
   - Deploy on AWS/Heroku/Railway
   - Use managed MongoDB (Atlas)

3. **Frontend Dashboard**
   - React.js with charts (Chart.js/Recharts)
   - Real-time budget visualization

4. **Advanced Features**
   - Receipt OCR (extract data from images)
   - Recurring expenses
   - Export to PDF/Excel
   - Email reports

5. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - API documentation (Swagger)

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl status mongod
```

### Port Already in Use
```bash
# Find process using port
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learning Resources

- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB University](https://university.mongodb.com/)
- [Microservices Patterns](https://microservices.io/patterns/index.html)
- [JWT.io](https://jwt.io/)

## 👨‍💻 Author

Your Name - [LinkedIn Profile] - [GitHub Profile]

## 📄 License

This project is open source and available under the MIT License.

---

**Pro Tip for Interviews:** Be ready to explain:
1. Why microservices over monolithic architecture?
2. How services communicate with each other?
3. What happens if one service fails?
4. How would you scale this application?
5. Security considerations in your implementation?

Good luck with your job search! 🚀
#   S m a r t - E x p e n s e s - T r a c k e r  
 