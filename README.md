# Angular 21 Authentication Boilerplate

[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-blue)](https://angular-21-boilerplate-sjzs.onrender.com)
[![Backend API](https://img.shields.io/badge/Backend-Node.js%20%7C%20MySQL-green)](https://node-mysql-api-zfzj.onrender.com)

A complete authentication system built with Angular 21. Features email sign-up with verification, JWT authentication with refresh tokens, role-based access control (Admin/User), forgot/reset password, and profile management.

## 🚀 Live Application

| Service | URL |
|---------|-----|
| **Frontend App** | [https://angular-21-boilerplate-sjzs.onrender.com](https://angular-21-boilerplate-sjzs.onrender.com) |
| **Backend API** | [https://node-mysql-api-zfzj.onrender.com](https://node-mysql-api-zfzj.onrender.com) |
| **API Documentation** | [https://node-mysql-api-zfzj.onrender.com/api-docs](https://node-mysql-api-zfzj.onrender.com/api-docs) |

## ✨ Features

- Email Sign Up with Verification
- JWT Authentication with Refresh Tokens
- Role-Based Authorization (User & Admin)
- Forgot Password & Reset Password
- View and Update My Profile
- Admin Section for Managing All Accounts
- Auto-refresh JWT token before expiry
- HTTP-Only Cookies for refresh tokens
- Bootstrap 5 Styling

## 👥 Roles

| Role | Access |
|------|--------|
| **Admin** | Full access to admin panel + manage all accounts |
| **User** | Can only update own profile |

> **Note:** The first account registered becomes Admin. All subsequent accounts are Users.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Angular 21 | Frontend framework |
| TypeScript | Type-safe JavaScript |
| RxJS | Reactive programming |
| Bootstrap 5 | UI styling |
| JWT | Authentication tokens |

## 🏗️ Project Structure
src/app/
├── _components/ # Reusable components (Alert)
├── _helpers/ # Guards, interceptors, validators
├── _models/ # TypeScript interfaces/enums
├── _services/ # API services (Account, Alert)
├── account/ # Auth pages (login, register, verify, forgot, reset)
├── admin/ # Admin dashboard + account management
├── profile/ # User profile (view, update)
└── home/ # Home page after login


## 🚀 How to Run Locally

### Prerequisites
- Node.js (v20.x or higher)
- Angular CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/kay-cee04/angular-21-boilerplate.git
cd angular-21-boilerplate
npm install