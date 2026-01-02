
# Multi-Tenant SaaS Platform

A production-style, role-based Multi-Tenant SaaS application built with **Node.js, Express, PostgreSQL, React, and Docker**.

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Node.js-green" alt="Node.js" />
  <img src="https://img.shields.io/badge/Frontend-React-blue" alt="React" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange" alt="JWT" />
  <img src="https://img.shields.io/badge/DevOps-Docker-informational" alt="Docker" />
</p>

## 🎥 Demo Video

▶ Watch full project walkthrough on YouTube
👉https://youtu.be/aHQRZevUIjY?si=d3p-dDCw3hme8SjO


The demo covers authentication, role-based access, tenant isolation, dashboards, projects, and tasks.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Roles & Access Control](#roles--access-control)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project-docker)
- [Database Migrations & Seeds](#database-migrations--seeds)
- [UI Flow](#ui-flow)
- [Error Handling](#error-handling)
- [Design Decisions](#design-decisions)
- [Future Improvements](#future-improvements)

---

## Overview

This application implements a **multi-tenant SaaS architecture**, where:

- A **Super Admin** manages tenants (organizations)
- Each **Tenant** has its own users, projects, and tasks
- **Tenant Admins** manage users and projects inside their tenant
- **Users** can view projects and project details (tasks)

All data is strictly isolated by tenant.

---

## Features

- JWT-based authentication
- Role-based access control (RBAC)
- Tenant isolation at database and API level
- Subscription plan limits (users, projects)
- Project and task management
- Read-only tenant plans
- Protected frontend routes
- Centralized error handling with toast notifications
- Fully Dockerized backend, frontend, and database

---

## Roles & Access Control

### Super Admin
- Login
- View tenants
- View subscription plan and limits (read-only)
- No access to tenant data (projects, users, tasks)

### Tenant Admin
- Login
- View dashboard (projects & users count)
- Create and manage projects
- Create and manage tasks inside projects
- Create and manage users (within limits)

### User
- Login
- View dashboard (projects count)
- View projects
- View project details (tasks)
- Read-only access

---

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (authentication)
- Docker

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- React Toastify

### DevOps
- Docker
- Docker Compose

---

## Architecture Overview

```
Client (React)
    ↓
   JWT
    ↓
API Gateway (Express)
    ↓
Tenant & Role Enforcement
    ↓
PostgreSQL (Tenant-isolated data)
```

- Authentication middleware extracts user identity from JWT
- RBAC middleware enforces role permissions
- Tenant middleware enforces tenant isolation
- Frontend protected routes prevent unauthorized navigation

---

## Project Structure

### Backend
```
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── migrations/
│   ├── seeds/
│   └── utils/
├── Dockerfile
└── package.json
```

### Frontend
```
├── src/
│   ├── api/
│   ├── auth/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── Dockerfile
└── package.json
```

---

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL=postgresql://user:password@postgres:5432/saas_db
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Running the Project (Docker)

### Prerequisites
- Docker
- Docker Compose

### Build and Run
```bash
docker-compose up -d --build
```

### Stop Containers
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs backend
docker-compose logs frontend
```

---

## Database Migrations & Seeds

- Migrations run automatically on container startup
- Seed data initializes:
  - Super Admin account
  - Sample tenant
  - Tenant Admin user

This ensures the application is usable immediately after startup.

---

## UI Flow

### Super Admin
```
Login → Tenants Dashboard
```

### Tenant Admin
```
Login → Dashboard → Projects → Project Details (Tasks) → Users
```

### User
```
Login → Dashboard → Projects → Project Details (Tasks)
```

Tasks are part of **Project Details**, not a standalone module.

---

## Error Handling

- Backend returns consistent error messages
- Frontend displays errors using toast notifications
- Global Axios interceptor handles:
  - 401 (session expired)
  - 403 (unauthorized access)
- Subscription limits are enforced and surfaced clearly

---

## Design Decisions

- No task assignment to users (not required by specification)
- No billing or plan upgrade UI (plans are configuration-based)
- Tenant-wide projects visible to all tenant users
- Read-only subscription plans
- Per-route RBAC (read and write permissions separated)
- Super Admin isolated from tenant-scoped data

These decisions keep the implementation aligned with requirements and avoid unnecessary complexity.

---

## Future Improvements

- Task assignment to users
- Plan upgrade workflow
- Activity and audit logs
- Pagination and search
- Production deployment (AWS, CI/CD)

---

## Conclusion

This project demonstrates a clean and practical implementation of a multi-tenant SaaS system with proper role separation, tenant isolation, and containerized development. The focus is on correctness, clarity, and maintainability rather than over-engineering.
