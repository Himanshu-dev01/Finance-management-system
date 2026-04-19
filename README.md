# Finance Management System

A full-stack web application to manage personal finances — track income/expenses, set budgets, and view reports.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3, Java |
| Frontend | React 18, Vite |
| Database | MySQL |
| ORM | Spring Data JPA + Hibernate |
| API Docs | Swagger / OpenAPI |
| Testing | JUnit 5, Mockito |
| Build Tool | Maven |

## Features

- Add, edit, delete transactions (Income / Expense)
- Filter transactions by type
- Set category-wise monthly budgets with progress tracking
- Dashboard with summary cards (total income, expense, savings)
- Bar chart — income vs expense vs savings overview
- Pie chart — expense breakdown by category
- RESTful APIs documented via Swagger UI

## Architecture

```
Frontend (React) → REST API (Spring Boot) → Service Layer → Repository (JPA) → MySQL
```

### Backend Layer Structure
```
com.example.finance/
├── entity/         → JPA entity classes (User, Transaction, Budget)
├── repository/     → Spring Data JPA interfaces
├── service/        → Business logic
├── controller/     → REST API endpoints
└── SecurityConfig  → Security configuration
```

### Frontend Structure
```
finance-ui/src/
├── pages/
│   ├── Dashboard.jsx    → Summary cards + charts
│   ├── Transactions.jsx → CRUD + filter
│   └── Budget.jsx       → Budget tracking
├── App.jsx              → Router + Navbar
└── index.css            → Global styles
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | Get all transactions |
| POST | /api/transactions | Add new transaction |
| PUT | /api/transactions/{id} | Update transaction |
| DELETE | /api/transactions/{id} | Delete transaction |
| GET | /api/budgets | Get all budgets |
| POST | /api/budgets | Set a budget |
| DELETE | /api/budgets/{id} | Delete budget |
| GET | /api/reports/summary | Get income/expense/savings summary |

Full interactive API docs: [Swagger UI](http://localhost:8080/swagger-ui/index.html)

## How to Run Locally

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+

### Backend
```bash
# 1. Create MySQL database
CREATE DATABASE finance_db;

# 2. Insert default user
USE finance_db;
INSERT INTO users (name, email) VALUES ('User', 'user@finance.com');

# 3. Update src/main/resources/application.properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

# 4. Run
./mvnw spring-boot:run
```
Backend runs on `http://localhost:8080`

### Frontend
```bash
cd finance-ui
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## Screenshots

> Dashboard, Transactions, and Budget screens — (add screenshots here)

## Problem Statement

Design and develop a full-stack Finance Management System using Spring Boot, React, and MySQL to help users track income and expenses, manage budgets by category, and view financial summaries through an interactive dashboard.

## Author
Himanshu(23051673) — KIIT University
