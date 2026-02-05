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

The system uses an **API Gateway** to handle all client requests, routing them to the specific microservice. Services communicate via REST APIs (and can be extended to message queues).

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
