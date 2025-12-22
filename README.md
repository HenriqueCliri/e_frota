# E-frota Fleet Management

## Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose

## Quick Start

### 1. Database (PostgreSQL)
Start the database container:
```bash
docker-compose up -d
```
*Note: Runs on port 5434 to avoid conflicts.*

### 2. Backend (Spring Boot)
Run the backend application:
```bash
cd backend
mvn spring-boot:run
```
*API: http://localhost:8080*

### 3. Frontend (React)
Run the frontend application:
```bash
cd frontend
npm run dev
```
*UI: http://localhost:5173*

## Authentication
- **Default Admin**: `admin` / `password`
