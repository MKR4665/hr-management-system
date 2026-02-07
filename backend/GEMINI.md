# 🚀 Industry-Grade Backend Application (Node.js + MySQL)

## 📌 Project Objective

Build a scalable, secure, and high-performance **backend system** using
**Node.js and MySQL**, following enterprise-level software engineering
standards.

⚠️ **IMPORTANT: TESTING IS STRICTLY MANDATORY. NO FEATURE IS COMPLETE
WITHOUT TESTS.**

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   Runtime: Node.js (LTS)
-   Framework: Express.js / Fastify
-   Language: JavaScript (ES6+)
-   Database: MySQL (8+)
-   ORM/Query Builder: Sequelize / Prisma / Knex
-   Testing: Jest / Mocha / Chai / Supertest (Mandatory)
-   Validation: Joi / Zod
-   Security: Helmet, Bcrypt, JWT
-   Linting: ESLint + Prettier

------------------------------------------------------------------------

## 📂 Clean Architecture Structure

    src/
    │
    ├── app/                 # App initialization
    │   ├── server.js
    │   └── routes.js
    │
    ├── domain/              # Business logic
    │   ├── entities/
    │   ├── usecases/
    │   └── interfaces/
    │
    ├── data/                # Database & external services
    │   ├── models/
    │   ├── repositories/
    │   └── migrations/
    │
    ├── presentation/        # Controllers & routes
    │   ├── controllers/
    │   ├── middlewares/
    │   └── validators/
    │
    ├── shared/              # Utilities
    │   ├── helpers/
    │   ├── constants/
    │   └── logger/
    │
    ├── tests/               # Mandatory tests
    │   ├── unit/
    │   ├── integration/
    │   └── e2e/
    │
    ├── config/              # Env configs
    │
    └── main.js

------------------------------------------------------------------------

## 📐 Core Principles

### SOLID

-   Single Responsibility
-   Open/Closed
-   Liskov Substitution
-   Interface Segregation
-   Dependency Inversion

### DRY

-   Reusable services
-   Shared utilities
-   Centralized configs

### Design Patterns

  Pattern      Usage
  ------------ ------------------
  Singleton    DB Connection
  Repository   Data Access
  Factory      Service Creation
  Strategy     Auth Handling
  Adapter      External APIs
  Middleware   Request Pipeline

------------------------------------------------------------------------

## 🧱 Architecture Layers

### Presentation Layer

-   Routes
-   Controllers
-   Middlewares
-   Input Validation

### Domain Layer

-   Entities
-   Use Cases
-   Business Rules

### Data Layer

-   Models
-   Repositories
-   Database Queries

### App Layer

-   Server Setup
-   Dependency Injection

------------------------------------------------------------------------

## 🧪 Mandatory Testing Policy

⚠️ ZERO EXCEPTIONS: ALL FEATURES MUST HAVE TESTS

### Required Tests

  Type          Tool             Required
  ------------- ---------------- ---------------
  Unit          Jest             ✅
  Integration   Supertest        ✅
  API           Jest/Supertest   ✅
  E2E           Playwright       ✅ (Critical)

------------------------------------------------------------------------

### Coverage Requirements

-   Overall: 85%+
-   Business Logic: 95%+
-   APIs: 90%+

PRs below coverage will be rejected.

------------------------------------------------------------------------

### TDD Workflow

    Write Test → Fail → Implement → Pass → Refactor

------------------------------------------------------------------------

## 📁 Test Structure

    tests/
    ├── unit/
    ├── integration/
    ├── e2e/
    ├── mocks/
    └── fixtures/

------------------------------------------------------------------------

## ⚡ Performance Optimization

-   Connection Pooling
-   Query Optimization
-   Indexing
-   Caching (Redis Optional)
-   Compression
-   Async/Await
-   Pagination

------------------------------------------------------------------------

## 🔐 Security Best Practices

-   JWT Authentication
-   Password Hashing (bcrypt)
-   SQL Injection Prevention
-   Rate Limiting
-   CORS Policy
-   Helmet Middleware
-   Secure ENV Variables

------------------------------------------------------------------------

## 🚫 Quality Gates (CI/CD)

All merges must pass:

✅ Lint\
✅ All Tests\
✅ Coverage Threshold\
✅ Build\
✅ Security Scan

------------------------------------------------------------------------

## 🗄️ Database Guidelines

-   Normalized Schema
-   Foreign Keys
-   Indexes
-   Migrations
-   Seeders
-   No Raw Queries (Without Review)

------------------------------------------------------------------------

## 🌍 Environment Setup

### Installation

``` bash
npm install
```

### Environment Variables

Create `.env` file:

``` env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=app_db
JWT_SECRET=your_secret
```

------------------------------------------------------------------------

### Development

``` bash
npm run dev
```

### Run Tests (Mandatory)

``` bash
npm test
npm run test:coverage
```

### Production

``` bash
npm run build
npm start
```

------------------------------------------------------------------------

## 📦 Git Workflow

-   Feature branches
-   PR Reviews
-   Tests Required
-   CI Validation

Example:

``` bash
feat: add user auth with tests
fix: api validation bug + tests
```

------------------------------------------------------------------------

## 📈 Documentation

Every module must include:

-   Purpose
-   Inputs/Outputs
-   Dependencies
-   Error Handling
-   Test Coverage

Use JSDoc + Swagger/OpenAPI.

------------------------------------------------------------------------

## 🤖 AI Development Instructions (STRICT MODE)

1.  Always write tests first
2.  No untested endpoints
3.  Follow Clean Architecture
4.  Secure every API
5.  Optimize DB queries
6.  Handle errors properly
7.  Document APIs
8.  Provide mocks
9.  Maintain readability
10. Ensure scalability

------------------------------------------------------------------------

## ✅ Acceptance Criteria

Project is complete only when:

✔ All APIs tested\
✔ Coverage ≥ 85%\
✔ No failing CI\
✔ Secure authentication\
✔ Optimized queries\
✔ Clean architecture enforced

------------------------------------------------------------------------

## 👤 Author

Mantu Kumar Singh

Project: Enterprise Node.js Backend Status: Active Development
