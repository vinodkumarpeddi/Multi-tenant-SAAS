🌐 Multi-Tenant SaaS Platform
<p align="center"> <strong>A production-style, role-based Multi-Tenant SaaS application</strong><br/> Built with <b>Node.js, Express, PostgreSQL, React, and Docker</b> </p> <p align="center"> <img src="https://img.shields.io/badge/Backend-Node.js-green" /> <img src="https://img.shields.io/badge/Frontend-React-blue" /> <img src="https://img.shields.io/badge/Database-PostgreSQL-blue" /> <img src="https://img.shields.io/badge/Auth-JWT-orange" /> <img src="https://img.shields.io/badge/DevOps-Docker-informational" /> </p>
🎥 Demo Video

▶ Watch full project walkthrough on YouTube
👉 https://www.youtube.com/watch?v=YOUR_VIDEO_ID

The demo covers authentication, role-based access, tenant isolation, dashboards, projects, and tasks.

(Replace YOUR_VIDEO_ID with your actual YouTube link)

📌 Overview

This project demonstrates a real-world Multi-Tenant SaaS architecture, similar to platforms like Jira, Notion, or Asana.

Key Concepts Implemented

Tenant isolation (row-level multi-tenancy)

Role-based access control (RBAC)

Subscription plan limits

Secure JWT authentication

Dockerized development environment

👥 Roles & Access Control
🛡️ Super Admin

Login to system dashboard

View all tenants

View subscription plans and limits

❌ No access to tenant-specific projects or users

🏢 Tenant Admin

Login to tenant dashboard

Create and manage projects

Create and manage tasks

Create and manage users (within plan limits)

👤 User

Login

View dashboard

View projects

View project tasks (read-only)

✨ Features

🔐 JWT-based authentication

🧩 Role-based access control (RBAC)

🏢 Strict tenant data isolation

📊 Subscription plan enforcement

📁 Project & task management

🔒 Protected frontend routes

🔔 Centralized error handling with toasts

🐳 Fully Dockerized (Frontend + Backend + DB)

🧱 Tech Stack
Backend

Node.js

Express.js

PostgreSQL

JWT Authentication

bcrypt

Docker

Frontend

React (Vite)

React Router

Axios

Tailwind CSS

React Toastify

DevOps

Docker

Docker Compose

🏗️ Architecture Overview
Client (React SPA)
        |
        |  JWT / REST API
        v
Backend API (Express)
        |
        |  Tenant & Role Enforcement
        v
PostgreSQL (Multi-Tenant Database)

Highlights

Stateless backend

Tenant enforcement via middleware

RBAC enforced at route level

Protected frontend routing

📁 Project Structure
Backend
backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── migrations/
│   ├── seeds/
│   ├── utils/
│   └── config/
├── Dockerfile
└── package.json

Frontend
frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── auth/
│   ├── utils/
│   └── App.jsx
├── Dockerfile
└── package.json

⚙️ Environment Variables
Backend (.env)
PORT=5000
DB_HOST=database
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

Frontend (.env)
VITE_API_URL=http://localhost:5000/api

🐳 Running the Project (Docker)
Prerequisites

Docker

Docker Compose

Build & Run
docker-compose up -d --build

Stop Containers
docker-compose down

View Logs
docker-compose logs backend
docker-compose logs frontend

🗄️ Database Migrations & Seeds

On startup, the system automatically:

Runs database migrations

Seeds initial data:

Super Admin account

Demo tenant

Tenant Admin & users

This allows instant login after startup.

🔄 UI Flow
Super Admin
Login → Tenants Dashboard

Tenant Admin
Login → Dashboard → Projects → Project Details (Tasks) → Users

User
Login → Dashboard → Projects → Project Details (Tasks)


Tasks are intentionally scoped under Projects (no standalone task page).

❗ Error Handling

Consistent API error responses

Frontend toast notifications

Global Axios interceptor handles:

401 → session expired

403 → unauthorized access

Subscription limit violations shown clearly

🧠 Design Decisions

No billing UI (plan-based configuration only)

No cross-tenant data access

No over-engineering (clean & readable code)

Super Admin isolated from tenant data

Per-route RBAC enforcement

🚀 Future Improvements

Task assignment to users

Activity & audit logs UI

Pagination & advanced search

CI/CD pipeline

Production deployment (AWS)

🏁 Conclusion

This project demonstrates a clean, scalable, and secure multi-tenant SaaS architecture following real-world best practices.
It focuses on correctness, maintainability, and clarity, making it ideal for interviews, portfolios, and production learning.
