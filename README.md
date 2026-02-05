# 💰 Smart Expense Tracker - Microservices Architecture

![Node.js](https://img.shields.io/badge/Node.js-v14+-green) ![Express.js](https://img.shields.io/badge/Express.js-Microservices-lightgrey) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green) ![Architecture](https://img.shields.io/badge/Architecture-Event--Driven-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

A production-ready **Distributed Expense Tracking System** built with Node.js. This project demonstrates advanced software engineering patterns including **Microservices**, **API Gateway**, **JWT Authentication**, and **Event-Driven Communication**.

---

## 🌟 Key Features

* **Microservices Architecture:** 5 independent services (User, Expense, Budget, Analytics, Notification).
* **Centralized API Gateway:** Single entry point routing requests to appropriate services.
* **Smart Budgeting:** Real-time monitoring with automated alerts when 80% of the budget is utilized.
* **Deep Analytics:** Spending trends, category analysis, and AI-driven insights.
* **Security:** Stateless authentication using JSON Web Tokens (JWT).
* **Scalability:** Each service uses its own MongoDB database (Database-per-service pattern).

---

## 🏗️ System Architecture

The system uses an **API Gateway** to handle all client requests, routing them to the specific microservice. Services communicate via REST APIs.

```mermaid
graph TD
    Client[Client (Web/Mobile)] --> Gateway[API Gateway :3000]
    
    Gateway --> User[User Service :3001]
    Gateway --> Expense[Expense Service :3002]
    Gateway --> Budget[Budget Service :3003]
    Gateway --> Analytics[Analytics Service :3004]
    Gateway --> Notify[Notification Service :3005]
    
    User --> DB1[(User DB)]
    Expense --> DB2[(Expense DB)]
    Budget --> DB3[(Budget DB)]
    Analytics --> DB4[(Analytics DB)]
    Notify --> DB5[(Notify DB)]
🧩 Services BreakdownServicePortDescriptionAPI Gateway3000The traffic controller. Routes requests, handles errors, and manages API versions.User Service3001Handles Registration, Login, JWT issuance, and Profile management.Expense Service3002CRUD operations for expenses, category management, and filtering.Budget Service3003(Core Feature) Monitors spending limits and triggers alerts.Analytics Service3004Aggregates data to provide charts, trends, and financial insights.Notification Service3005Manages alerts (Email/SMS/Push) for budget overflows and summaries.🚀 Getting StartedPrerequisitesNode.js (v14+)MongoDB (Local or Atlas Cloud)Git1. InstallationClone the repository:Bashgit clone [https://github.com/tanzirrabby/Smart-Expenses-Tracker.git](https://github.com/tanzirrabby/Smart-Expenses-Tracker.git)
cd smart-expense-tracker
2. Dependency SetupYou need to install dependencies for each service. Open your terminal and run:Bash# Install Gateway dependencies
cd api-gateway && npm install && cd ..

# Install Service dependencies
cd user-service && npm install && cd ..
cd expense-service && npm install && cd ..
cd budget-service && npm install && cd ..
cd analytics-service && npm install && cd ..
cd notification-service && npm install && cd ..
3. Environment ConfigurationCreate a .env file in each service folder (e.g., user-service/.env, expense-service/.env).Example .env content:Code snippetPORT=3001  # Change based on the specific service port
MONGO_URI=mongodb+srv://<your_db_connection>
JWT_SECRET=your_super_secret_key
4. Running the ApplicationTo see the full system in action, you need to run all services simultaneously. Open 6 separate terminal tabs and run npm start in each folder:cd api-gateway && npm startcd user-service && npm startcd expense-service && npm startcd budget-service && npm startcd analytics-service && npm startcd notification-service && npm start🧪 API DocumentationAll requests should be sent to the API Gateway (Port 3000).🔐 AuthenticationMethodEndpointDescriptionPayloadPOST/api/auth/registerRegister User{username, email, password, currency}POST/api/auth/loginLogin{email, password}💸 ExpensesMethodEndpointDescriptionHeadersPOST/api/expensesAdd Expenseuser-id: <id>GET/api/expensesGet All Expensesuser-id: <id>GET/api/expenses/summaryGet Category Summaryuser-id: <id>📊 Budgets & AnalyticsMethodEndpointDescriptionPOST/api/budgetsSet a Monthly BudgetGET/api/analytics/insightsGet AI Spending InsightsGET/api/analytics/trendsGet 6-month Spending Trend🛠️ Tech Stack & Concepts DemonstratedRuntime: Node.jsFramework: Express.jsDatabase: MongoDB (Mongoose ODM)Authentication: JWT (JSON Web Tokens)Patterns: Microservices, API Gateway, Database-per-Service, Event-Driven Architecture.
