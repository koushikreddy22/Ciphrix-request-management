# 🗂️ Request Management System

A full-stack workflow application where **employees create requests** and **managers approve or reject them**.
Built using **React + TypeScript + Vite + shadcn-ui** and **Node.js + Express + PostgreSQL**.

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- TypeScript
- shadcn-ui
- Tailwind CSS
- React Query
- React Router

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg
- JWT
- bcrypt

---

## 🚀 Features

### 👨‍💼 Employee
- Create new requests
- Assign requests to another employee
- View:
  - **Created by Me**
  - **Assigned to Me**
- Close requests (only after approval)

### 👨‍💼 Manager
- View requests assigned to employees under them
- Approve / Reject requests
- View:
  - **Pending Approval**
  - **Handled** (Approved / Rejected)

### 🔒 Authentication
- JWT secure login
- Password hashing using bcrypt
- Protected routes for each role

---

## 📁 Project Structure

```
/
├── frontend/
├── backend/
├── database.sql
├── .env.example
└── README.md
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (preferably via [NVM](https://github.com/nvm-sh/nvm))
- [PostgreSQL](https://www.postgresql.org/download/) **OR** [Docker](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/downloads)

---

## 🗄️ Database Setup

1.  **Create a database:**

    ```sql
    CREATE DATABASE request_management;
    ```

2.  **Run the setup script:**

    ```bash
    psql -d request_management -f database.sql
    ```

---

## 💻 Running the Application

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧑‍💻 Demo Credentials

### Demo Managers

-   **Email:** `john.doe@demo.com`
-   **Password:** `Password@123`

-   **Email:** `jane.smith@demo.com`
-   **Password:** `Password@122`