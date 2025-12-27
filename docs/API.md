
---

# 📘 docs/API.md (All 19 APIs)

```md
# API Documentation

## Auth
1. POST /auth/register-tenant
2. POST /auth/login
3. POST /auth/logout
4. GET /auth/me

## Tenants
5. GET /tenants/:id
6. PUT /tenants/:id
7. GET /tenants

## Users
8. POST /tenants/:id/users
9. GET /tenants/:id/users
10. PUT /users/:id
11. DELETE /users/:id

## Projects
12. POST /projects
13. GET /projects
14. PUT /projects/:id
15. DELETE /projects/:id

## Tasks
16. POST /projects/:id/tasks
17. GET /projects/:id/tasks
18. PATCH /tasks/:id/status
19. PUT /tasks/:id
