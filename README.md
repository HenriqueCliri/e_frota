# E-frota - Sistema de Gestão de Frotas

Sistema completo de gestão de frotas com backend em Spring Boot e frontend em React.

## 🚀 Tecnologias

### Backend
- Java 17, Spring Boot 3
- Spring Security + JWT
- PostgreSQL
- Maven

### Frontend
- React 18, Vite
- TailwindCSS v4
- Axios, React Router DOM

## 📋 Funcionalidades

- ✅ Gestão de Caminhões, Motoristas, Viagens
- ✅ Gestão de Manutenções e Clientes
- ✅ Autenticação JWT
- ✅ Banco PostgreSQL

## 🔧 Pré-requisitos

- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

## 📦 Instalação

### 1. PostgreSQL
```bash
sudo -u postgres psql -c "CREATE DATABASE efrota;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Autenticação

Acesse `http://localhost:5173/login` e registre um usuário via API:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
