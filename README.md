# 🗂️ Request Management System  
A full-stack workflow application where **employees create requests** and **managers approve or reject them**.  
Built using **React + TypeScript + Vite + shadcn-ui** and **Node.js + Express + PostgreSQL**.

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

## 📁 Project Structure

/frontend
/backend
/database/database.sql # contains all table creation SQL
/.env.example
/README.md

---

# ⚙️ Prerequisites

Install:

- Node.js (preferably via NVM)
- PostgreSQL **OR** Docker
- Git

---

# 🗄️ Database Setup

### 👉 Option 1: Install PostgreSQL locally  
Create a database:

sql
CREATE DATABASE request_management;
psql -d request_management -f database/database.sql
-----
Demo Managers
Email: john.doe@demo.com
Password: Password@123

Email: jane.smith@demo.com
Password: Password@123
-----
💻 Running the Backend
cd backend
npm install
npm run dev
--------------------------------------------------------------------------------------------
💻 Running the Frontend
cd frontend
npm install
npm run dev
------------------------------------------------------
