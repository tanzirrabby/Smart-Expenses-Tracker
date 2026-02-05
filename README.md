# 💰 Smart Expense Tracker - Microservices Architecture

![Node.js](https://img.shields.io/badge/Node.js-v14+-green) ![Express.js](https://img.shields.io/badge/Express.js-Microservices-lightgrey) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green) ![Architecture](https://img.shields.io/badge/Architecture-Event--Driven-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

A production-ready **Distributed Expense Tracking System** built with Node.js. This project demonstrates advanced software engineering patterns including **Microservices**, **API Gateway**, **JWT Authentication**, and **Event-Driven Communication**.

---

## 🌟 Project Highlights
- **Microservices Architecture** with 5 independent services.
- **API Gateway Pattern** for centralized request routing and security.
- **Smart Budgeting** with real-time alerts (80% threshold).
- **Advanced Analytics** for spending trends and daily patterns.
- **State-of-the-art UI** with React, featuring dark mode and data exports.

---

## 🏗️ System Architecture

The system is designed with a "Database-per-service" pattern to ensure horizontal scalability and fault isolation. All traffic flows through the API Gateway, which handles authentication.



### 🧩 Services Breakdown

| Service | Port | Description |
| :--- | :--- | :--- |
| **API Gateway** | `3000` | The entry point. Handles routing, security, and error aggregation. |
| **User Service** | `3001` | Manages registration, login, and JWT token issuance. |
| **Expense Service** | `3002` | Handles all transaction CRUD operations and categorization. |
| **Budget Service** | `3003` | Real-time budget monitoring and threshold alert logic. |
| **Analytics Service** | `3004` | Data aggregation for trends, summaries, and spending insights. |
| **Notification Service** | `3005` | Multi-channel delivery for alerts and weekly reports. |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v14 or higher)
* **MongoDB** (Local instance or MongoDB Atlas Cloud)
* **Git**

### 1. Installation & Dependencies
Clone the repository and install dependencies for the gateway and all 5 services:

```bash
git clone [https://github.com/tanzirrabby/Smart-Expenses-Tracker.git](https://github.com/tanzirrabby/Smart-Expenses-Tracker.git)
cd smart-expense-tracker

# Quick install for all services
for dir in api-gateway user-service expense-service budget-service analytics-service notification-service; do
  cd $dir && npm install && cd ..
done

2. Environment Configuration
Create a .env file in each service folder with your credentials:

Code snippet
PORT=300x                     # Port specific to the service
MONGO_URI=mongodb+srv://...    # Your MongoDB connection string
JWT_SECRET=your_secret_key    # Used for authentication
3. Running the System
Open separate terminals for each service and run:

Bash
npm start
Alternatively, use the provided start-all.ps1 (PowerShell) or setup.sh (Linux/Mac) scripts in the root directory.

API Reference
All requests must be directed to the Gateway (Port 3000). Use the included Postman-Collection.json for testing.

Auth Endpoints
POST /api/auth/register - Create a new account.

POST /api/auth/login - Authenticate and receive JWT.

Transaction Endpoints
POST /api/expenses - Create income or expense (Header: user-id).

GET /api/expenses - Fetch history with date/type filtering.

GET /api/analytics/insights - Get AI-driven spending patterns.

Tech Stack & Patterns
Backend: Node.js, Express.js

Database: MongoDB, Mongoose ODM

Frontend: React 19, Vite, Axios

Auth: JSON Web Tokens (JWT)

Patterns: Single Responsibility, Reverse Proxy, Stateless Auth, Decentralized Data.
