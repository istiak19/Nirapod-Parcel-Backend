# 📦 Nirapod Parcel

A secure and modular RESTful API built with **Express.js** and **Mongoose** for managing a full-fledged parcel delivery system. Inspired by leading courier services like Pathao, DHL and Sundarban, this backend system supports user registration, parcel creation, delivery tracking, and robust role-based access for **Admins**, **Senders**, and **Receivers**.

> 🚀 Live API: [https://nirapod-parcel.vercel.app](https://nirapod-parcel.vercel.app/)
> 📬 API Docs (Postman): [View Documentation](https://documenter.getpostman.com/view/40122875/2sB3BALCQm)

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
* [🖼 File Uploads & Media Handling](#-file-uploads--media-handling)
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
* ♻️ **Full status transitions** with cancellation, return, and rescheduling
* 🔁 **Receiver actions**: return and reschedule
* 🛡️ **Protected routes** with `checkAuth` middleware
* 💡 **OTP system**, Google OAuth login
* 📃 **Zod validation** for robust input handling
* 🖼 **Cloudinary + Multer** for image/file uploads (e.g., parcel images, documents)
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

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 📦 API Modules

| Module    | Description                                |
| --------- | ------------------------------------------ |
| `auth`    | Login, Google OAuth, password mgmt         |
| `user`    | Registration, profile mgmt, role access    |
| `otpCode` | Send & verify OTP                          |
| `parcel`  | Full parcel lifecycle mgmt                 |
| `upload`  | File/image uploads via Multer + Cloudinary |

---

## 📌 Role-Based Access

| Role         | Capabilities                                                           |
| ------------ | ---------------------------------------------------------------------- |
| **Admin**    | View/update all users and parcels, block/unblock, change parcel status |
| **Sender**   | Create, cancel, and view parcels and status logs                       |
| **Receiver** | View incoming parcels, confirm delivery, return or reschedule parcels  |

---

## 🔑 Authentication Flow

* ✅ JWT Access/Refresh tokens
* ✅ Google OAuth login
* ✅ Password Reset Flow (forget → verify OTP → set new password)
* ✅ Middleware-based role authorization

---

## 📬 Parcel Lifecycle & Status Flow

### 📌 `parcelStatus` Values

```ts
type parcelStatus =
  | "Requested"
  | "Approved"
  | "Dispatched"
  | "In Transit"
  | "Delivered"
  | "Cancelled"
  | "Returned"
  | "Rescheduled";
```

### Lifecycle Example

```
Requested → Approved → Dispatched → In Transit → Delivered
                                         ↘ Returned
                                         ↘ Rescheduled
                        ↘ Cancelled
```

Each parcel includes:

* `trackingId`: Format → `TRK-YYYYMMDD-XXXXXX`
* `trackingEvents[]`: `{ status, timestamp, location?, updatedBy, note }`

Parcel actions:

* ❌ Cancel (before dispatch)
* 🔁 Return (by receiver)
* 📆 Reschedule (by receiver)
* ✅ Confirm delivery (by receiver)

---

## 📄 API Endpoints Summary

*(same as before — auth, user, parcel, otp routes)*

---

## 🖼 File Uploads & Media Handling

This project supports **file/image uploads** using **Multer** (for request parsing) and **Cloudinary** (for storage & CDN delivery).

### 🔧 Setup

1. Add Cloudinary credentials to `.env`
2. Use the upload route/module (example):

```ts
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nirapod-parcel",
    allowed_formats: ["jpg", "png", "pdf"],
  },
});

const upload = multer({ storage });
```

3. Example endpoint:

```ts
router.post("/upload", upload.single("file"), (req, res) => {
  res.json({ url: req.file.path });
});
```

### 📂 Use Cases

* Sender uploads parcel image/documents
* Admin verification documents
* User profile pictures

---

## 🧪 Testing

* ✅ Fully tested with [Postman Collection](https://documenter.getpostman.com/view/40122875/2sB3BALCQm)
* ✅ HTTP status code & error response consistency
* ✅ All payloads validated using Zod
* ✅ JWT-secured route validation
* ✅ File upload tests with Cloudinary sandbox

---

## 🗂 Project Structure

```bash
src/
├── modules/
│   ├── auth/        # Login, Google, Password.js
│   ├── user/        # User registration & profile
│   ├── parcel/      # Parcel management + tracking logic
│   ├── otpCode/     # OTP verification
│   ├── upload/      # File upload with Multer + Cloudinary
├── middlewares/
│   ├── checkAuth.ts
│   ├── validateRequest.ts
├── config/
│   ├── env.config.ts
├── utils/           # Helper functions
├── app.ts           # Main app entry
├── server.ts        # HTTP server bootstrap
```

---

## 🧑‍💻 Contributors

* **Istiak Ahmed** — Creator and Maintainer
  GitHub: [@istiak19](https://github.com/istiak19)