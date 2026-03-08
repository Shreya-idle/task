# Advanced Enterprise Scalable REST API 🚀

This backend project implements a strict **Enterprise Level Serverless/Microservice ready** architecture. 
It covers everything requested in the task (Standardized Error, Multi-Tenant, Unit Tests, Dockerization, Redis Caching, DRY/KISS code conventions, Swagger UI, and JWT Role-based Auth).

## 🏗 Implemented Software Design Patterns
You asked for a specific single-word answer for the main framework structure, which is **MVC (Model-View-Controller)** or more accurately **Layered Architecture**. However, this codebase utilizes multiple core Software patterns:
1. **Repository Pattern**: MongoDB models are isolated entirely behind `UserRepository` and `TaskRepository`. This enforces **KISS** (Keep It Simple, Stupid) for controllers.
2. **Factory Method Pattern**: Standardized Global Error Handlers rely on `ResponseFactory.js`, ensuring massive **DRY** (Don't Repeat Yourself) compliance. Every response has an identical payload structure.
3. **Singleton Pattern**: Built inside `config/db.js` and `config/redis.js` to ensure massive concurrency handling without connection leaks.
4. **Middleware (Chain of Responsibility) Pattern**: Handlers like `authMiddleware` and the newly implemented `tenantMiddleware` intercept routing requests seamlessly.

## ✨ Advanced Features Included
- **Multi-Tenant Architecture**: Every model enforces a mandatory `tenant` property. Requests must come with `x-tenant-id` header (injected via Frontend's Axios Interceptors). One API deployment can host isolated clients!
- **Redis Caching**: Whenever `GET /tasks` is called, the `TaskService` routes the massive query result into Redis. `create/update/delete` triggers an immediate smart Cache Flush.
- **Dockerization Orchestration**: Contains `Dockerfile` per sub-repository and a robust `docker-compose.yml` to spin up Redis, MongoDB, Nginx (Frontend), and Node APIs instantly via `docker-compose up`.
- **100% Mocked Unit Tests**: Fully standalone TDD Unit Tests using Jest + SuperTest mimicking real POST/GET logic isolated from production DB via mock MongoDB connections and mocked Redis clients. Check `tests/`!
- **Swagger UI**: Visit `http://localhost:5000/api-docs` out of the box!

## 🏃‍♂️ How to Run via Docker
```bash
docker-compose up --build -d
```
All containers will instantly link locally!

## 🧪 How to execute Unit Tests
```bash
cd backend
npm test
```
