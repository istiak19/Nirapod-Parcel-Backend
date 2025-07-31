# 📦 Nirapod Parcel

A secure and modular RESTful API built with **Express.js** and **Mongoose** for managing a full-fledged parcel delivery system. Inspired by leading courier services like Pathao and Sundarban, this backend system supports user registration, parcel creation, delivery tracking, and robust role-based access for **Admins**, **Senders**, and **Receivers**.

> 🚀 Live API: [https://nirapod-parcel-backend.vercel.app/](https://nirapod-parcel-backend.vercel.app/)

---

## 📚 Table of Contents

* [✨ Features](#-features)
* [🛠 Installation](#-installation)
* [⚙️ Environment Variables](#️-environment-variables)
* [📦 API Modules](#-api-modules)
* [📌 Role-Based Access](#-role-based-access)
* [🔑 Authentication Flow](#-authentication-flow)
* [📬 Parcel Lifecycle & Status Flow](#-parcel-lifecycle--status-flow)
* [📄 API Endpoints Summary](#-api-endpoints-summary)
* [🧪 Testing](#-testing)
* [🗂 Project Structure](#-project-structure)
* [🧑‍💻 Contributors](#-contributors)
* [📝 License](#-license)

---

## ✨ Features

* 🔐 **JWT Authentication** with `bcrypt` for password hashing
* 🧑‍💼 **Role-based authorization** for `Admin`, `Sender`, `Receiver`
* 📦 **Parcel management** with embedded status logs
* 🛤 **Parcel tracking** via unique tracking IDs
* ♻️ **Status transitions**: Requested → Approved → Dispatched → In Transit → Delivered
* 🛡️ **Protected routes** with `checkAuth` middleware
* 💡 **OTP system**, Google OAuth login
* 📃 **Zod validation** for robust input handling
* 🧱 **Scalable modular architecture**

---

## 🛠 Installation

```bash
git clone https://github.com/istiak19/Nirapod-Parcel-Backend
cd nirapod-parcel-backend
npm install
cp .env.example .env # configure your environment variables
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

---

## ⚙️ Environment Variables

Create a `.env` file with the following:

```env
PORT=5000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
FRONTEND_URL=https://your-frontend-domain.com
```

---

## 📦 API Modules

| Module    | Description                             |
| --------- | --------------------------------------- |
| `auth`    | Login, Google OAuth, password mgmt      |
| `user`    | Registration, profile mgmt, role access |
| `otpCode` | Send & verify OTP                       |
| `parcel`  | Full parcel lifecycle mgmt              |

---

## 📌 Role-Based Access

| Role         | Capabilities                                                    |
| ------------ | --------------------------------------------------------------- |
| **Admin**    | View/update all users and parcels, block/unblock, change status |
| **Sender**   | Create/cancel/view parcels, view status logs                    |
| **Receiver** | View incoming parcels, confirm delivery, check delivery history |

---

## 🔑 Authentication Flow

* **JWT Access/Refresh tokens**
* **Google OAuth**
* **Password Reset** (forget, reset, change)
* **Protected Routes** via `checkAuth` middleware

---

## 📬 Parcel Lifecycle & Status Flow

### Parcel Status Transitions

```
Requested → Approved → Dispatched → In Transit → Delivered
```

Each parcel includes:

* `trackingId`: `TRK-YYYYMMDD-XXXXXX`
* `trackingEvents[]`: `{ status, timestamp, location?, updatedBy, note }`
* `isBlocked`, `isCanceled`, `deliveryDate`, `fee`, `receiverInfo`

---

## 📄 API Endpoints Summary

### 🔐 Auth (`/api/v1/auth`)

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| POST   | `/login`           | Login with credentials      |
| POST   | `/logout`          | Logout and clear session    |
| POST   | `/refresh-token`   | Refresh access token        |
| POST   | `/change-password` | Change password (protected) |
| POST   | `/forget-password` | Request reset via email/OTP |
| POST   | `/reset-password`  | Submit OTP + new password   |
| GET    | `/google`          | Initiate Google login       |
| GET    | `/google/callback` | Google OAuth callback       |

---

### 👤 Users (`/api/v1/user`)

| Method | Endpoint    | Access | Description        |
| ------ | ----------- | ------ | ------------------ |
| POST   | `/register` | Public | Create user        |
| GET    | `/get-me`   | All    | Get current user   |
| GET    | `/all-user` | Admin  | List all users     |
| GET    | `/:id`      | Admin  | Get user by ID     |
| PATCH  | `/:id`      | All    | Update own profile |

---

### 📦 Parcels (`/api/v1/parcels`)

| Method | Endpoint             | Role     | Description                   |
| ------ | -------------------- | -------- | ----------------------------- |
| GET    | `/`                  | Admin    | Get all parcels               |
| GET    | `/me`                | Sender   | Sender’s parcels              |
| POST   | `/`                  | Sender   | Create a parcel               |
| PATCH  | `/cancel/:id`        | Sender   | Cancel a parcel               |
| GET    | `/incoming`          | Receiver | View parcels sent to receiver |
| GET    | `/history`           | Receiver | Delivery history              |
| PATCH  | `/delivered/:id`     | Receiver | Confirm delivery              |
| GET    | `/track/:trackingId` | All      | Track parcel by ID            |
| GET    | `/status-log/:id`    | Sender   | View status logs              |
| PATCH  | `/status/:id`        | Admin    | Update parcel status          |
| PATCH  | `/block/:id`         | Admin    | Block/Unblock parcel          |

---

### 🔁 OTP (`/api/v1/otp`)

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| POST   | `/send`   | Send OTP to user     |
| POST   | `/verify` | Verify submitted OTP |

---

## 🧪 Testing

* ✅ Tested via Postman Collection (login, protected access, CRUD operations)
* ✅ Supports status code consistency, success/failure messages
* ✅ Validated inputs via Zod

---

## 🗂 Project Structure

```bash
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── parcel/     # Includes status tracking logic
│   ├── otpCode/
├── middlewares/
│   ├── checkAuth.ts
│   ├── validateRequest.ts
├── config/
│   ├── env.config.ts
├── utils/
├── app.ts
├── server.ts
```

---

## 🧑‍💻 Contributors

* **You** — Builder of Nirapod Parcel API